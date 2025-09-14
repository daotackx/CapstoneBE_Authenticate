import { OAuth2Client } from 'google-auth-library'
import userModel from '../models/user.model.js'
import ApiError from '../utils/ApiError.js'
import { StatusCodes } from 'http-status-codes'
import { hashPassword } from '../utils/password.js'
import { sendMail } from '../utils/sendMail.js'
import { comparePassword } from '../utils/password.js'
import {
  getVerifyEmailTemplate,
  getResetPasswordTemplate
} from '../utils/emailTemplates.js'
import { JwtProvider } from '../utils/jwt.js'
import { env } from '../config/env.js'
const registerService = async (userData) => {
  try {
    // Kiểm tra email đã tồn tại chưa
    const existedUser = await userModel.findOne({ email: userData.email })
    if (existedUser) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Email đã tồn tại')
    }
    // Hash mật khẩu
    const hashedPassword = await hashPassword(userData.password)
    const user = await userModel.create({
      ...userData,
      password: hashedPassword,
      is_verified: false
    })
    // Sinh token xác thực email (JWT, hết hạn sau 1 giờ)
    const emailVerifyToken = await JwtProvider.generateToken(
      { email: user.email, _id: user._id },
      env.SMTP.JWT_EMAIL_SECRET,
      env.SMTP.EMAIL_EXPIRES_IN
    )

    const verifyLink = `${
      env.WEBSITE_URL
    }/verify-email?email=${encodeURIComponent(
      user.email
    )}&token=${emailVerifyToken}`

    await sendMail({
      to: user.email,
      subject: 'Xác thực tài khoản',
      html: getVerifyEmailTemplate(user.full_name, verifyLink)
    })
    return user
  } catch (error) {
    throw error
  }
}
const loginService = async ({ email, password }) => {
  try {
    // Tìm user theo email
    const user = await userModel.findOne({ email })
    if (!user) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        'Email hoặc mật khẩu không đúng'
      )
    }
    // So sánh mật khẩu
    const isMatch = await comparePassword(password, user.password)
    if (!isMatch) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        'Email hoặc mật khẩu không đúng'
      )
    }
    if (!user.is_verified) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'Tài khoản chưa xác thực email')
    }
    return user
  } catch (error) {
    throw error
  }
}

const verifyEmailService = async (email, token) => {
  try {
    // Giải mã token
    const decodedToken = await JwtProvider.verifyToken(
      token,
      env.SMTP.JWT_EMAIL_SECRET
    )
    if (decodedToken.email !== email) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'Link xác thực hết hạn')
    }
    // Tìm user theo email
    const user = await userModel.findOne({ email })
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Tài khoản không tồn tại')
    }

    if (user.is_verified) {
      return user
    }
    // Xác thức email
    user.is_verified = true

    await user.save()
    return user
  } catch (error) {
    throw error
  }
}

// Service đăng nhập bằng Google
const googleLoginService = async (idToken) => {
  const client = new OAuth2Client(env.GOOGLE.CLIENT_ID)
  let ticket
  try {
    ticket = await client.verifyIdToken({
      idToken,
      audience: env.GOOGLE.CLIENT_ID
    })
  } catch (err) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'idToken Google không hợp lệ')
  }
  const payload = ticket.getPayload()
  if (!payload?.email) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Không lấy được email từ Google'
    )
  }
  // Tìm user theo email
  let user = await userModel.findOne({ email: payload.email })
  if (!user) {
    // Nếu chưa có user thì tạo mới
    user = await userModel.create({
      email: payload.email,
      full_name: payload.name || 'No Name',
      avatar: payload.picture || '/useravatardefault.png',
      is_verified: true
      // Có thể bổ sung các trường khác nếu muốn
    })
  }
  return user
}

// Gửi email quên mật khẩu
const forgotPasswordService = async (email) => {
  const user = await userModel.findOne({ email })
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'Email không tồn tại')
  const resetToken = await JwtProvider.generateToken(
    { email: user.email, _id: user._id },
    env.JWT.RESET_PASSWORD_SECRET,
    env.JWT.RESET_PASSWORD_EXPIRES_IN
  )
  const resetLink = `${env.WEBSITE_URL}/reset-password?token=${resetToken}`
  await sendMail({
    to: user.email,
    subject: 'Yêu cầu đặt lại mật khẩu',
    html: getResetPasswordTemplate(user.full_name, resetLink)
  })
  return true
}

// Đổi mật khẩu qua link reset
const resetPasswordService = async (token, newPassword) => {
  let decoded
  try {
    decoded = await JwtProvider.verifyToken(
      token,
      env.JWT.RESET_PASSWORD_SECRET
    )
  } catch (err) {
    throw new ApiError(
      StatusCodes.UNAUTHORIZED,
      'Token không hợp lệ hoặc đã hết hạn'
    )
  }
  const user = await userModel.findOne({ email: decoded.email })
  if (!user)
    throw new ApiError(StatusCodes.NOT_FOUND, 'Tài khoản không tồn tại')
  user.password = await hashPassword(newPassword)
  await user.save()
  return true
}

// Đổi mật khẩu khi đã đăng nhập
const changePasswordService = async (userId, oldPassword, newPassword) => {
  // Tìm user theo id
  const user = await userModel.findById(userId)
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'Tài khoản không tồn tại')
  // Kiểm tra mật khẩu cũ
  const isMatch = await comparePassword(oldPassword, user.password)
  if (!isMatch) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Mật khẩu cũ không đúng')
  // Hash và cập nhật mật khẩu mới
  user.password = await hashPassword(newPassword)
  await user.save()
  return true
}

export const authService = {
  registerService,
  loginService,
  verifyEmailService,
  googleLoginService,
  forgotPasswordService,
  resetPasswordService,
  changePasswordService
}

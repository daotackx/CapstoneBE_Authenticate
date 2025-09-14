import { StatusCodes } from 'http-status-codes'
import { env } from '../config/env.js'
import { authService } from '../services/auth.service.js'
import { JwtProvider } from '../utils/jwt.js'
import ApiError from '../utils/ApiError.js'
const register = async (req, res, next) => {
  try {
    // Gọi service đăng ký
    const user = await authService.registerService(req.body)

    res.status(StatusCodes.CREATED).json({
      message:
        'Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.',
      user: {
        email: user.email,
        full_name: user.full_name,
        is_verified: user.is_verified
      }
    })
  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
  try {
    const user = await authService.loginService(req.body)
    const userInfo = {
      _id: user._id,
      email: user.email,
      full_name: user.full_name,
      role: user.role
    }
    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.JWT.ACCESS_SECRET,
      env.JWT.ACCESS_EXPIRES_IN
    )
    const refreshToken = await JwtProvider.generateToken(
      userInfo,
      env.JWT.REFRESH_SECRET,
      env.JWT.REFRESH_EXPIRES_IN
    )
    res.status(StatusCodes.OK).json({
      message: 'Đăng nhập thành công',
      userInfo,
      accessToken,
      refreshToken
    })
  } catch (error) {
    next(error)
  }
}

const logout = async (req, res, next) => {
  try {
    res.status(StatusCodes.OK).json({ message: 'Logout API success!' })
  } catch (error) {
    next(error)
  }
}

const refreshToken = async (req, res, next) => {
  try {
    const refreshTokenFromBody = req.body?.refreshToken

    //Verify refreshToken xem co hop le khong?
    const refreshTokenDecoded = await JwtProvider.verifyToken(
      refreshTokenFromBody,
      env.JWT.REFRESH_SECRET
    )

    const userInfo = {
      _id: refreshTokenDecoded._id,
      email: refreshTokenDecoded.email,
      full_name: refreshTokenDecoded.full_name,
      role: refreshTokenDecoded.role
    }

    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.JWT.ACCESS_SECRET,
      env.JWT.ACCESS_EXPIRES_IN
    )
    // Tra ve accessToken moi cho truong hop FE can update lai trong localstorage
    res.status(StatusCodes.OK).json({ accessToken })
  } catch (error) {
    next(error)
  }
}

export const verifyEmail = async (req, res, next) => {
  try {
    const user = await authService.verifyEmailService(req.query.email, req.query.token)
    res.status(StatusCodes.OK).json({ message: 'Xác thực email thành công' })
  } catch (error) {
    next(error)
  }
}

// Đăng nhập bằng Google
const googleLogin = async (req, res, next) => {
  try {
    const { idToken } = req.body
    if (!idToken) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Thiếu idToken')
    }
    const user = await authService.googleLoginService(idToken)
    const userInfo = {
      _id: user._id,
      email: user.email,
      full_name: user.full_name,
      role: user.role
    }
    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.JWT.ACCESS_SECRET,
      env.JWT.ACCESS_EXPIRES_IN
    )
    const refreshToken = await JwtProvider.generateToken(
      userInfo,
      env.JWT.REFRESH_SECRET,
      env.JWT.REFRESH_EXPIRES_IN
    )
    res.status(StatusCodes.OK).json({
      message: 'Đăng nhập Google thành công',
      userInfo,
      accessToken,
      refreshToken
    })
  } catch (error) {
    next(error)
  }
}

// Quên mật khẩu - gửi email
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body
    await authService.forgotPasswordService(email)
    res
      .status(StatusCodes.OK)
      .json({
        message: 'Đã gửi email đặt lại mật khẩu, vui lòng kiểm tra hộp thư.'
      })
  } catch (error) {
    next(error)
  }
}

// Đổi mật khẩu qua link reset
const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body
    if (!token || !newPassword)
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Thiếu token hoặc mật khẩu mới'
      )
    await authService.resetPasswordService(token, newPassword)
    res.status(StatusCodes.OK).json({ message: 'Đổi mật khẩu thành công!' })
  } catch (error) {
    next(error)
  }
}

const changePassword = async (req, res, next) => {
  try {
    const userId = req.user._id 
    const { oldPassword, newPassword } = req.body
    if (!oldPassword || !newPassword) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Thiếu mật khẩu cũ hoặc mới')
    }
    await authService.changePasswordService(userId, oldPassword, newPassword)
    res.status(StatusCodes.OK).json({ message: 'Đổi mật khẩu thành công!' })
  } catch (error) {
    next(error)
  }
}

export const authController = {
  login,
  logout,
  refreshToken,
  register,
  verifyEmail,
  googleLogin,
  forgotPassword,
  resetPassword,
  changePassword
}

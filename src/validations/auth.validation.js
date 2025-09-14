import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '../utils/ApiError.js'
const registerValidation = async (req, res, next) => {
  const registerSchema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Email phải đúng định dạng email',
      'any.required': 'Vui lòng nhập email'
    }),
    password: Joi.string()
      .pattern(/^[a-zA-Z0-9]{6,}$/)
      .required()
      .messages({
        'string.pattern.base':
          'Mật khẩu phải có ít nhất 6 ký tự và chỉ bao gồm chữ cái hoặc số',
        'any.required': 'Vui lòng nhập mật khẩu'
      }),
    full_name: Joi.string().min(3).required().messages({
      'string.min': 'Họ tên phải có ít nhất 3 ký tự',
      'any.required': 'Vui lòng nhập họ tên'
    }),
    phone_number: Joi.string()
      .pattern(/^(0[3|5|7|8|9][0-9]{8}|(\+84)[3|5|7|8|9][0-9]{8})$/)
      .required()
      .messages({
        'string.pattern.base':
          'Số điện thoại không hợp lệ (VD: 0912345678 hoặc +84912345678)',
        'any.required': 'Vui lòng nhập số điện thoại'
      })
  })

  try {
    await registerSchema.validateAsync(req.body, { abortEarly: false })

    next()
  } catch (error) {
    next(
      new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
    )
  }
}

const loginValidation = async (req, res, next) => {
  const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Email phải đúng định dạng email',
      'any.required': 'Vui lòng nhập email'
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Mật khẩu phải có ít nhất 6 ký tự',
      'any.required': 'Vui lòng nhập mật khẩu'
    })
  })
  try {
    await loginSchema.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(
      new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
    )
  }
}

const changePasswordValidation = async (req, res, next) => {
  const schema = Joi.object({
    oldPassword: Joi.string().min(6).required().messages({
      'string.min': 'Mật khẩu cũ phải có ít nhất 6 ký tự',
      'any.required': 'Vui lòng nhập mật khẩu cũ'
    }),
    newPassword: Joi.string().min(6).required().messages({
      'string.min': 'Mật khẩu mới phải có ít nhất 6 ký tự',
      'any.required': 'Vui lòng nhập mật khẩu mới'
    })
  })
  try {
    await schema.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(
      new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
    )
  }
}

export const authValidation = {
  registerValidation,
  loginValidation,
  changePasswordValidation
}

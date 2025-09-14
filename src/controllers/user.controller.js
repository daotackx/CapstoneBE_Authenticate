import User from '../models/user.model.js'
import { StatusCodes } from 'http-status-codes'
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password')
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Không tìm thấy user' })
    }
    res.status(StatusCodes.OK).json({ user: user })
  } catch (err) {
    next(err)
  }
}

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password')
    res.status(StatusCodes.OK).json({ users: users })
  } catch (err) {
    next(err)
  }
}

export const userController = {
  getUsers,
  getMe
}

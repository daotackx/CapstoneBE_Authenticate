import { StatusCodes } from 'http-status-codes'
import { env } from '../config/env.js'
import { JwtProvider } from '../utils/jwt.js'
const isAuthorized = async (req, res, next) => {
  const accessToken = req.headers.authorization?.split(' ')[1]
  if (!accessToken) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'Unauthorized! (Token not found in headers)' })
    return
  }

  try {
    const accessTokenDecoded = await JwtProvider.verifyToken(
      accessToken,
      env.JWT.ACCESS_SECRET
    )

    req.user = accessTokenDecoded
    next()
  } catch (error) {
    //TH1: accessToken het han
    if (error.message.includes('jwt expired')) {
      res.status(StatusCodes.GONE).json({ message: 'Need to refresh token' }, { error: error.message })
      return
    }
    //TH2: accessToken khong hop le
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: 'Unauthorized! Please login again',
      error: error.message
    })
  }
}

export const authMiddleware = {
  isAuthorized
}

import express from 'express'
import { authController } from '../controllers/auth.controller.js'
import { authValidation } from '../validations/auth.validation.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'
const router = express.Router()

router.post(
  '/register',
  authValidation.registerValidation,
  authController.register
)
router.post('/login', authValidation.loginValidation, authController.login)
router.put('/refresh-token', authController.refreshToken)
router.get('/verify-email', authController.verifyEmail)
router.post('/google-login', authController.googleLogin)
router.post('/forgot-password', authController.forgotPassword)
router.post('/reset-password', authController.resetPassword)
router.post(
  '/change-password',
  authMiddleware.isAuthorized,
  authValidation.changePasswordValidation,
  authController.changePassword
)

export const authRoutes = router

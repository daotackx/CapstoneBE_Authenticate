import express from 'express'
import { userController } from '../controllers/user.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'

const router = express.Router()

// Lấy danh sách user
router.get('/', authMiddleware.isAuthorized, userController.getUsers)

// Lấy user hiện tại từ token
router.get('/me', authMiddleware.isAuthorized, userController.getMe)

export const userRoutes = router

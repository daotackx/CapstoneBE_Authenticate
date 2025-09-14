import { Router } from 'express'
import { authRoutes } from './auth.routes.js'
import { userRoutes } from './user.routes.js'

const router = Router()
router.use('/auth', authRoutes)
router.use('/users', userRoutes)

const API_V1s = router
export default API_V1s

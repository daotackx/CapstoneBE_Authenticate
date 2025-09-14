import express from 'express'
import cors from 'cors'
import { env } from './config/env.js'
import { connectDB } from './config/db.js'
import { errorHandlerMiddleware } from './middlewares/errorHandler.middleware.js'
import APIs_V1 from './routes/index.js'
const start_server = () => {
  const app = express()

  // Enable req.body json data
  app.use(express.json())

  app.use(
    cors({
      origin: env.WEBSITE_URL,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    })
  )

  // use APIs V1
  app.use('/api/v1', APIs_V1)

  // Sử dụng Error Handler Middleware
  app.use(errorHandlerMiddleware)

  app.listen(env.PORT, () => {
    console.log(`3. Server is running on port ${env.PORT}`)
  })
}

;(async () => {
  try {
    console.log('1. Connecting to database...')
    await connectDB()
    start_server()
  } catch (error) {
    console.error('Database connection error', error)
    process.exit(1)
  }
})()

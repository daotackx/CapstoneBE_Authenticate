import dotenv from 'dotenv'
dotenv.config()

export const env = {
  PORT: Number(process.env.PORT) || 5000,
  MONGODB_URI: process.env.MONGODB_URI,
  DATABASE_NAME: process.env.DATABASE_NAME,
  BUILD_MODE: process.env.BUILD_MODE || 'dev', // 'dev' | 'prod'
  WEBSITE_URL: process.env.WEBSITE_URL || 'http://localhost:5173',
  JWT: {
    ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    ACCESS_EXPIRES_IN: process.env.ACCESS_EXPIRES_IN,
    REFRESH_EXPIRES_IN: process.env.REFRESH_EXPIRES_IN,
    RESET_PASSWORD_SECRET: process.env.RESET_PASSWORD_SECRET,
    RESET_PASSWORD_EXPIRES_IN: process.env.RESET_PASSWORD_EXPIRES_IN
  },
  GOOGLE: { CLIENT_ID: process.env.GOOGLE_CLIENT_ID },
  SMTP: {
    JWT_EMAIL_SECRET: process.env.JWT_EMAIL_SECRET,
    EMAIL_EXPIRES_IN: process.env.EMAIL_EXPIRES_IN || '1h',
    HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
    PORT: Number(process.env.SMTP_PORT) || 587,
    SECURE: process.env.SMTP_SECURE === 'true',
    USER: process.env.SMTP_USER || '',
    PASS: process.env.SMTP_PASS || '',
    FROM: process.env.SMTP_FROM || 'no-reply@example.com'
  }
}

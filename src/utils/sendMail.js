import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

const transporter = nodemailer.createTransport({
    host: env.SMTP.HOST,
    port: env.SMTP.PORT,
    secure: env.SMTP.SECURE, // true for 465, false for other ports
    auth: {
        user: env.SMTP.USER,
        pass: env.SMTP.PASS
    }
})

export const sendMail = async ({ to, subject, html }) => {
    const mailOptions = {
        from: env.SMTP.FROM,
        to,
        subject,
        html
    }
    await transporter.sendMail(mailOptions)
}
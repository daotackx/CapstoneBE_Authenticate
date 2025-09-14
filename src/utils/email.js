import nodemailer from 'nodemailer'
import { env } from '../config/env.js'

// Tạo transporter với thông tin từ biến môi trường
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS
  }
});

/**
 * Gửi email xác thực tài khoản
 * @param {string} to - Địa chỉ email người nhận
 * @param {string} subject - Tiêu đề email
 * @param {string} html - Nội dung email dạng HTML
 */
async function sendMail(to, subject, html) {
  const mailOptions = {
    from: env.EMAIL_USER,
    to,
    subject,
    html
  };
  await transporter.sendMail(mailOptions);
}

module.exports = { sendMail };

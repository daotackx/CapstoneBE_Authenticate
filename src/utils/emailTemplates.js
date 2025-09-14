export const getResetPasswordTemplate = (name, url) => {
    return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #4CAF50;">Yêu cầu đặt lại mật khẩu</h2>
        <p>Xin chào ${name},</p>
        <p>Bạn vừa yêu cầu đặt lại mật khẩu. Vui lòng nhấn vào nút bên dưới để đổi mật khẩu mới:</p>
        <a href="${url}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Đặt lại mật khẩu</a>
        <p style="margin-top: 20px;">Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>
        <p style="margin-top: 20px;">Trân trọng,<br/>Đội ngũ hỗ trợ</p>
    </div>
    `;
}
export const getVerifyEmailTemplate = (name, url) => {
    return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #4CAF50;">Welcome to Our Service, ${name}!</h2>
        <p style="margin-bottom: 20px;">Hi ${name},</p>
        <p style="margin-bottom: 20px;">Thank you for signing up for our service. To verify your email address, please click the link below:</p>
        <a href="${url}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
        <p style="margin-top: 20px;">If you did not sign up for this account, please ignore this email.</p>
        <p style="margin-top: 20px;">Best regards,<br/>The Team</p>
    </div>
    `;
}
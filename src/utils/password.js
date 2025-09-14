// Tiện ích hash và kiểm tra mật khẩu sử dụng bcrypt
// Tất cả comment đều bằng tiếng Việt

import bcrypt from 'bcrypt';
const SALT_ROUNDS = 10;

/**
 * Hash mật khẩu
 * @param {string} password
 * @returns {Promise<string>}
 */
export async function hashPassword(password) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * So sánh mật khẩu với hash
 * @param {string} password
 * @param {string} hash
 * @returns {Promise<boolean>}
 */
export async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

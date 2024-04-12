const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const KEY_SECRET = 'chuot';

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
function isStrongPassword(password) {
  // Kiểm tra độ dài tối thiểu
  if (password.length < 8) {
    return false;
  }

  // Kiểm tra ký tự chữ cái
  if (!/[a-zA-Z]/.test(password)) {
    return false;
  }

  // Kiểm tra ký tự số
  if (!/\d/.test(password)) {
    return false;
  }

  // Kiểm tra ký tự đặc biệt
  if (!/[^a-zA-Z0-9]/.test(password)) {
    return false;
  }

  return true;
}
async function hashPassword(password) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (error) {
    throw new Error('Không thể băm mật khẩu: ' + error.message);
  }
}

async function comparePasswords(plainPassword, hashedPassword) {
  try {
    const match = await bcrypt.compare(plainPassword, hashedPassword);
    return match;
  } catch (error) {
    throw new Error('Không thể so sánh mật khẩu: ' + error.message);
  }
}

function generateToken(_id) {
  return jwt.sign({ _id }, KEY_SECRET, { expiresIn: '1h' });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, KEY_SECRET);
  } catch (error) {
    throw new Error('Token không hợp lệ: ' + error.message);
  }
}


module.exports = {
  isValidEmail,
  isStrongPassword,
  hashPassword,
  comparePasswords,
  generateToken,
  verifyToken,
};

const UserDAO = require('../dao/UserDAO');
const User = require('../models/User');

class UserService {
  static async getProfile(id) {
    const row = await UserDAO.findById(id);
    if (!row) return null;
    return new User(row);
  }

  static async changePassword(userId, oldPass, newPass) {
    const row = await UserDAO.findById(userId);
    if (!row) throw new Error('Không tìm thấy user');

    const bcrypt = require('bcryptjs');
    const ok = await bcrypt.compare(oldPass, row.password);
    if (!ok) throw new Error('Mật khẩu cũ không đúng');

    await UserDAO.updatePassword(userId, newPass);
  }
}

module.exports = UserService;

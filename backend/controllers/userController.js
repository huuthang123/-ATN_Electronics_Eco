const UserService = require('../services/UserService');

class UserController {
  static async getMe(req, res) {
    try {
      const user = await UserService.getProfile(req.user.userId);
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async changePassword(req, res) {
    try {
      const { oldPassword, newPassword } = req.body;
      await UserService.changePassword(req.user.userId, oldPassword, newPassword);
      res.json({ message: "Đổi mật khẩu thành công" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  static async getName(req, res) {
    try {
      const user = await UserService.getProfile(req.params.userId);
      if (!user) return res.status(404).json({ message: "Không tìm thấy user" });
      res.json({ username: user.username || "Ẩn danh" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = UserController;

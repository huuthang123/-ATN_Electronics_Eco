const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../models');
const User = db.User;

class AuthController {
  // [POST] /api/auth/register
  static async register(req, res) {
    try {
      const { username, email, phone, password } = req.body;

      // Kiểm tra trùng email
      const existing = await User.findOne({ where: { email } });
      if (existing)
        return res.status(400).json({ message: 'Email đã tồn tại' });

      // Mã hóa mật khẩu
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);

      // Tạo user mới
      const user = await User.create({
        username,
        email,
        phone,
        password: hashed,
      });

      // Tạo JWT
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.status(201).json({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      });
    } catch (error) {
      console.error('Lỗi khi đăng ký:', error);
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  }

  // [POST] /api/auth/login
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });
      if (!user)
        return res.status(400).json({ message: 'Email không tồn tại' });

      // Kiểm tra mật khẩu
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ message: 'Mật khẩu không đúng' });

      // Tạo JWT token
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      });
    } catch (error) {
      console.error('Lỗi khi đăng nhập:', error);
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  }

  // [GET] /api/auth/me
  static async getMe(req, res) {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: ['id', 'username', 'email', 'phone', 'role'],
      });
      if (!user)
        return res.status(404).json({ message: 'Không tìm thấy người dùng' });
      res.json(user);
    } catch (error) {
      console.error('Lỗi khi lấy thông tin user:', error);
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  }
}

module.exports = AuthController;

const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.User;


class UserController {
static async register(req, res) {
try {
const { email, password } = req.body;
if (!email || !password) return res.status(400).json({ message: 'Vui lòng cung cấp email và mật khẩu' });


const exists = await User.findOne({ where: { email } });
if (exists) return res.status(400).json({ message: 'Email đã tồn tại' });


const salt = await bcrypt.genSalt(10);
const hash = await bcrypt.hash(password, salt);
const user = await User.create({ email, password: hash });


const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });
res.status(201).json({ token, user: { id: user.id, email: user.email } });
} catch (error) {
console.error('Đăng ký lỗi:', error);
res.status(500).json({ message: 'Lỗi server khi đăng ký' });
}
}


static async login(req, res) {
try {
const { email, password } = req.body;
if (!email || !password) return res.status(400).json({ message: 'Vui lòng cung cấp email và mật khẩu' });


const user = await User.findOne({ where: { email } });
if (!user) return res.status(401).json({ message: 'Thông tin đăng nhập không hợp lệ' });


const ok = await bcrypt.compare(password, user.password);
if (!ok) return res.status(401).json({ message: 'Thông tin đăng nhập không hợp lệ' });


const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });
res.json({ token, user: { id: user.id, email: user.email } });
} catch (error) {
console.error('Đăng nhập lỗi:', error);
res.status(500).json({ message: 'Lỗi server khi đăng nhập' });
}
}


static async getMe(req, res) {
try {
const me = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
if (!me) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
res.json(me);
} catch (error) {
res.status(500).json({ message: 'Lỗi server khi lấy thông tin' });
}
}


static async changePassword(req, res) {
try {
const { oldPassword, newPassword } = req.body;
const user = await User.findByPk(req.user.id);
if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });


const ok = await bcrypt.compare(oldPassword, user.password);
if (!ok) return res.status(400).json({ message: 'Mật khẩu cũ không đúng' });


const salt = await bcrypt.genSalt(10);
user.password = await bcrypt.hash(newPassword, salt);
await user.save();
res.json({ message: 'Đổi mật khẩu thành công' });
} catch (error) {
res.status(500).json({ message: 'Lỗi server khi đổi mật khẩu' });
}
}


static async getName(req, res) {
try {
const { userId } = req.params;
const user = await User.findByPk(userId, { attributes: ['username'] });
if (!user) return res.status(404).json({ message: 'Người dùng không tồn tại' });
const username = user.username && user.username.trim() !== '' ? user.username : 'Ẩn danh';
res.json({ username });
} catch (error) {
res.status(500).json({ message: 'Lỗi hệ thống khi lấy tên người dùng' });
}
}
}
module.exports = UserController;
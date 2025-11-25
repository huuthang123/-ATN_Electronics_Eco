const jwt = require('jsonwebtoken');
const UserDAO = require('../dao/UserDAO');
const AuthDAO = require('../dao/AuthDAO');

class AuthService {
  static async register(data) {
    const exist = await UserDAO.findByEmail(data.email);
    if (exist) throw new Error('Email đã tồn tại');

    await UserDAO.create({ ...data, role: 'customer' });

    const user = await UserDAO.findByEmail(data.email);

    const accessToken = jwt.sign(
      { id: user.userId },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return { user, accessToken };
  }

  static async login(email, password) {
    const user = await UserDAO.findByEmail(email);
    if (!user) throw new Error('Email không tồn tại');

    const bcrypt = require('bcryptjs');
    
    // Debug: Log để kiểm tra
    console.log('🔍 Debug login:');
    console.log('  - Email:', email);
    console.log('  - Password từ request:', password);
    console.log('  - Password từ DB (length):', user.password?.length);
    console.log('  - Password từ DB (is hash?):', user.password?.startsWith('$2'));
    
    // Kiểm tra xem password trong DB có phải là hash không
    const isHashed = user.password && user.password.startsWith('$2');
    
    let ok = false;
    if (isHashed) {
      // Password đã được hash, dùng bcrypt.compare
      ok = await bcrypt.compare(password, user.password);
    } else {
      // Password chưa được hash (plain text), so sánh trực tiếp
      console.log('⚠️  WARNING: Password trong DB chưa được hash! So sánh plain text');
      ok = password === user.password;
    }
    
    if (!ok) {
      console.log('❌ Password không khớp');
      throw new Error('Sai mật khẩu');
    }

    console.log('✅ Password khớp, tạo token...');
    const accessToken = jwt.sign(
      { id: user.userId },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      { expiresIn: "1h" }
    );

    return { user, accessToken };
  }
}

module.exports = AuthService;

const sql = require('mssql');

const config = {
<<<<<<< HEAD
  user: process.env.DB_USER || 'admin_web',
  password: process.env.DB_PASSWORD || '123456',
  server: process.env.DB_SERVER || 'XUANHANH\\CSDL',
  port: parseInt(process.env.DB_PORT) || 1433,
  database: process.env.DB_NAME || 'EcoDB',
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};

const connectDB = async () => {
  try {
    await sql.connect(config);
    console.log(`✅ Connected to SQL Server (${config.server}:${config.port})`);
  } catch (error) {
    console.error('❌ Lỗi kết nối SQL Server:', error);
  }
};

module.exports = { connectDB, sql, config };  // ⭐ EXPORT CONFIG LUÔN

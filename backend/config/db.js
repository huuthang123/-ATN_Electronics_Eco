const sql = require('mssql');

const config = {
<<<<<<< HEAD
  user: process.env.DB_USER || 'admin_web',
  password: process.env.DB_PASSWORD || '123456',
  server: process.env.DB_SERVER || 'XUANHANH\\CSDL',
=======
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || 'Thang@123',
  server: process.env.DB_SERVER || 'DESKTOP-RJSRD5P',
>>>>>>> ae0593a67756b636735aa87496db449960755e2a
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
<<<<<<< HEAD
    console.log(`✅ Connected to SQL Server (${config.server}:${config.port})`);
=======
    console.log('✅ Connected to SQL Server (localhost:1433)');
>>>>>>> ae0593a67756b636735aa87496db449960755e2a
  } catch (error) {
    console.error('❌ Lỗi kết nối SQL Server:', error);
  }
};

module.exports = { connectDB, sql, config };  // ⭐ EXPORT CONFIG LUÔN

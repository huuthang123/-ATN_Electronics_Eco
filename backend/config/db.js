const sql = require('mssql');

const config = {
  user: 'sa',
  password: 'Thang@123',
  server: 'localhost',
  port: 1433,
  database: 'EcommerceDB',
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};

const connectDB = async () => {
  try {
    await sql.connect(config);
    console.log('✅ Connected to SQL Server (localhost:1433)');
  } catch (error) {
    console.error('❌ Lỗi kết nối SQL Server:', error);
  }
};

module.exports = { connectDB, sql };
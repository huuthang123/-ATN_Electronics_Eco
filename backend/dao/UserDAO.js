const { sql } = require('../config/db');
const bcrypt = require('bcryptjs');

class UserDAO {
  static async getAll() {
    return (await sql.query`SELECT * FROM Users`).recordset;
  }

  static async findById(userId) {
    return (await sql.query`
      SELECT * FROM Users WHERE userId = ${userId}
    `).recordset[0];
  }

  static async findByEmail(email) {
    return (await sql.query`
      SELECT * FROM Users WHERE email = ${email}
    `).recordset[0];
  }

  static async create({ username, email, phone, password, role }) {
    const hash = await bcrypt.hash(password, 10);

    await sql.query`
      INSERT INTO Users (username, email, phone, password, role, createdAt, updatedAt)
      VALUES (${username}, ${email}, ${phone}, ${hash}, ${role}, GETDATE(), GETDATE())
    `;
  }

  static async updatePassword(userId, newPassword) {
    const hash = await bcrypt.hash(newPassword, 10);

    await sql.query`
      UPDATE Users
      SET password = ${hash}, updatedAt = GETDATE()
      WHERE userId = ${userId}
    `;
  }
}

module.exports = UserDAO;

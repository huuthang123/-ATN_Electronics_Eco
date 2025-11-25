const { sql } = require('../config/db');

class AuthDAO {
  static async saveToken({ userId, refreshToken }) {
    const exists = await sql.query`SELECT * FROM Auth WHERE userId = ${userId}`;

    if (exists.recordset.length > 0) {
      await sql.query`
        UPDATE Auth
        SET refreshToken = ${refreshToken}, createdAt = GETDATE()
        WHERE userId = ${userId}
      `;
    } else {
      await sql.query`
        INSERT INTO Auth (userId, refreshToken, createdAt)
        VALUES (${userId}, ${refreshToken}, GETDATE())
      `;
    }
  }

  static async getTokenByUser(userId) {
    return (
      await sql.query`
        SELECT * FROM Auth WHERE userId = ${userId}
      `
    ).recordset[0];
  }

  static async deleteToken(userId) {
    await sql.query`DELETE FROM Auth WHERE userId = ${userId}`;
  }
}

module.exports = AuthDAO;

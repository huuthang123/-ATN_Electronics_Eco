const { sql } = require('../config/db');

class PromotionDAO {
  static async getAll() {
    return (
      await sql.query`
        SELECT * FROM Promotion ORDER BY startDate DESC
      `
    ).recordset;
  }

  static async create(data) {
    const { code, description, discountPercent, startDate, endDate } = data;

    await sql.query`
      INSERT INTO Promotion (code, description, discountPercent, startDate, endDate)
      VALUES (${code}, ${description}, ${discountPercent}, ${startDate}, ${endDate})
    `;
  }

  static async getByCode(code) {
    return (
      await sql.query`
        SELECT * FROM Promotion WHERE code = ${code}
      `
    ).recordset[0];
  }
}

module.exports = PromotionDAO;

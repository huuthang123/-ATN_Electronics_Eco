const { sql } = require('../config/db');

class CategoryDAO {
  static async getAll() {
    return (
      await sql.query`
        SELECT * FROM Category ORDER BY createdAt DESC
      `
    ).recordset;
  }

  static async getById(id) {
    return (
      await sql.query`
        SELECT * FROM Category WHERE categoryId = ${id}
      `
    ).recordset[0];
  }

  static async create(data) {
    const { name, description, parentId, slug } = data;

    await sql.query`
      INSERT INTO Category (name, description, parentId, slug, createdAt, updatedAt)
      VALUES (${name}, ${description}, ${parentId}, ${slug}, GETDATE(), GETDATE())
    `;
  }

  static async update(id, data) {
    const keys = Object.keys(data).filter(k => data[k] !== undefined);

    for (const key of keys) {
      await sql.query`
        UPDATE Category
        SET ${sql.raw(key)} = ${data[key]}, updatedAt = GETDATE()
        WHERE categoryId = ${id}
      `;
    }
  }

  static async deleteById(id) {
    const r = await sql.query`
      DELETE FROM Category WHERE categoryId = ${id}
    `;
    return r.rowsAffected[0] > 0;
  }
}

module.exports = CategoryDAO;

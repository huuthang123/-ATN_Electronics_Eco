const { sql } = require('../config/db');

class AttributeDAO {
  static async getAll(categoryId) {
    if (categoryId) {
      return (
        await sql.query`
          SELECT * FROM ProductAttribute WHERE categoryId = ${categoryId}
        `
      ).recordset;
    }

    return (await sql.query`SELECT * FROM ProductAttribute`).recordset;
  }

  static async getById(id) {
    return (
      await sql.query`
        SELECT * FROM ProductAttribute WHERE id = ${id}
      `
    ).recordset[0];
  }

  static async create(data) {
    const { categoryId, name, valueType } = data;

    await sql.query`
      INSERT INTO ProductAttribute (categoryId, name, valueType, createdAt, updatedAt)
      VALUES (${categoryId}, ${name}, ${valueType}, GETDATE(), GETDATE())
    `;
  }

  static async update(id, data) {
    const { name, valueType } = data;

    await sql.query`
      UPDATE ProductAttribute
      SET
        name = ${name},
        valueType = ${valueType},
        updatedAt = GETDATE()
      WHERE id = ${id}
    `;
  }

  static async delete(id) {
    await sql.query`
      DELETE FROM ProductAttribute WHERE id = ${id}
    `;
  }
}

module.exports = AttributeDAO;

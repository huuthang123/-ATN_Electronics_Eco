const { sql } = require('../config/db');

class ProductAttributeValueDAO {
  static async getAll() {
    return (
      await sql.query`SELECT * FROM ProductAttributeValue`
    ).recordset;
  }

  static async getByProduct(productId) {
    return (
      await sql.query`
        SELECT *
        FROM ProductAttributeValue
        WHERE productId = ${productId}
      `
    ).recordset;
  }

  static async create(data) {
    const { productId, attributeName, attributeValue } = data;

    await sql.query`
      INSERT INTO ProductAttributeValue (productId, attributeName, attributeValue)
      VALUES (${productId}, ${attributeName}, ${attributeValue})
    `;
  }
}

module.exports = ProductAttributeValueDAO;

const { sql } = require("../config/db");

class ProductImageDAO {
  static async getByProductId(productId) {
    const result = await sql.query`
      SELECT * FROM ProductImage WHERE productId = ${productId}
    `;
    return result.recordset;
  }

  static async create({ productId, imageUrl, color }) {
    await sql.query`
      INSERT INTO ProductImage (productId, imageUrl, color)
      VALUES (${productId}, ${imageUrl}, ${color})
    `;
  }

  static async update(imageId, { imageUrl, color }) {
    await sql.query`
      UPDATE ProductImage
      SET imageUrl = ${imageUrl},
          color = ${color}
      WHERE imageId = ${imageId}
    `;
  }

  static async delete(imageId) {
    await sql.query`
      DELETE FROM ProductImage WHERE imageId = ${imageId}
    `;
  }
}

module.exports = ProductImageDAO;

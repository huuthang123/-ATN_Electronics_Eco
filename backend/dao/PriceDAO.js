const { sql } = require('../config/db');
const Price = require('../models/Price');

class PriceDAO {
  static async getAll(productId) {
    let result;

    if (productId) {
      result = await sql.query`
        SELECT * 
        FROM ProductPrice 
        WHERE productId = ${productId}
      `;
    } else {
      result = await sql.query`
        SELECT * 
        FROM ProductPrice
      `;
    }

    // Map thành Price Model
    return result.recordset.map(row => new Price(row));
  }

  static async getById(priceId) {
    const result = await sql.query`
      SELECT * 
      FROM ProductPrice 
      WHERE priceId = ${priceId}
    `;

    if (!result.recordset[0]) return null;

    return new Price(result.recordset[0]);
  }

  static async create(price) {
    const { productId, optionName, optionPrice } = price;

    await sql.query`
      INSERT INTO ProductPrice (productId, optionName, optionPrice, createdAt, updatedAt)
      VALUES (${productId}, ${optionName}, ${optionPrice}, GETDATE(), GETDATE())
    `;
  }

  static async update(priceId, price) {
    const { optionName, optionPrice } = price;

    await sql.query`
      UPDATE ProductPrice
      SET optionName = ${optionName},
          optionPrice = ${optionPrice},
          updatedAt = GETDATE()
      WHERE priceId = ${priceId}
    `;
  }

  static async delete(priceId) {
    await sql.query`
      DELETE FROM ProductPrice 
      WHERE priceId = ${priceId}
    `;
  }
}

module.exports = PriceDAO;

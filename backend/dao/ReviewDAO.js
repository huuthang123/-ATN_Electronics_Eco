const { sql } = require('../config/db');

class ReviewDAO {
  static async getByProduct(productId) {
    return (
      await sql.query`
        SELECT r.*, u.username
        FROM Review r
        JOIN Users u ON r.userId = u.userId
        WHERE r.productId = ${productId}
        ORDER BY r.createdAt DESC
      `
    ).recordset;
  }

  static async getByUserOrderProduct({ userId, orderId, productId }) {
    return (
      await sql.query`
        SELECT *
        FROM Review
        WHERE userId = ${userId} 
        AND orderId = ${orderId}
        AND productId = ${productId}
      `
    ).recordset[0];
  }

  static async create(data) {
    const { userId, orderId, productId, rating, comment } = data;

    await sql.query`
      INSERT INTO Review (userId, orderId, productId, rating, comment, createdAt)
      VALUES (${userId}, ${orderId}, ${productId}, ${rating}, ${comment}, GETDATE())
    `;
  }

  static async update(id, data) {
    const { rating, comment } = data;

    await sql.query`
      UPDATE Review
      SET rating = ${rating}, comment = ${comment}
      WHERE reviewId = ${id}
    `;
  }

  static async delete(id) {
    const r = await sql.query`
      DELETE FROM Review WHERE reviewId = ${id}
    `;
    return r.rowsAffected[0] > 0;
  }

  static async findById(id) {
    return (
      await sql.query`
        SELECT *
        FROM Review
        WHERE reviewId = ${id}
      `
    ).recordset[0];
  }
}

module.exports = ReviewDAO;

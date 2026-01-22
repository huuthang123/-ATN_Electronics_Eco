const { sql } = require('../config/db');

class ReviewDAO {

  // Lấy review theo product (dùng hiển thị chi tiết sản phẩm)
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

  // ⭐ HÀM QUAN TRỌNG NHẤT CHO RECOMMENDATION (User–User CF)
  static async getAll() {
    return (
      await sql.query`
        SELECT userId, productId, rating
        FROM Review
      `
    ).recordset;
  }

  // Kiểm tra user đã review sản phẩm chưa
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

  // Tạo review mới
  static async create(data) {
    const { userId, orderId, productId, rating, comment } = data;

    await sql.query`
      INSERT INTO Review (userId, orderId, productId, rating, comment, createdAt)
      VALUES (${userId}, ${orderId}, ${productId}, ${rating}, ${comment}, GETDATE())
    `;
  }

  // Update review
  static async update(id, data) {
    const { rating, comment } = data;

    await sql.query`
      UPDATE Review
      SET rating = ${rating}, comment = ${comment}
      WHERE reviewId = ${id}
    `;
  }

  // Xoá review
  static async delete(id) {
    const r = await sql.query`
      DELETE FROM Review WHERE reviewId = ${id}
    `;
    return r.rowsAffected[0] > 0;
  }

  // Tìm review theo ID
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

const { sql } = require('../config/db');

class SummaryDAO {
  static async getByProduct(productId) {
    return (
      await sql.query`
        SELECT * FROM ProductSummary WHERE productId = ${productId}
      `
    ).recordset[0];
  }

  static async create(data) {
    const { productId, summary, wordFreq, totalReviews } = data;

    await sql.query`
      INSERT INTO ProductSummary (productId, summary, wordFreq, totalReviews, lastUpdated)
      VALUES (
        ${productId},
        ${summary},
        ${JSON.stringify(wordFreq)},
        ${totalReviews},
        GETDATE()
      )
    `;
  }

  static async update(productId, data) {
    const { summary, wordFreq, totalReviews } = data;

    await sql.query`
      UPDATE ProductSummary
      SET
        summary = ${summary},
        wordFreq = ${JSON.stringify(wordFreq)},
        totalReviews = ${totalReviews},
        lastUpdated = GETDATE()
      WHERE productId = ${productId}
    `;
  }
}

module.exports = SummaryDAO;

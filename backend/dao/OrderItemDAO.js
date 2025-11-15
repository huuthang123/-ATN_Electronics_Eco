// dao/OrderItemDAO.js
const { sql } = require('../config/db');

class OrderItemDAO {
  async getByOrder(orderId) {
    const r = await sql.query`
      SELECT orderItemId, orderId, productId, quantity, unitPrice
      FROM OrderItem
      WHERE orderId = ${orderId}
    `;
    return r.recordset;
  }

  async createMany(orderId, items, request = null) {
    const executor = request || sql;

    for (const it of items) {
      await executor.query`
        INSERT INTO OrderItem (orderId, productId, quantity, unitPrice)
        VALUES (${orderId}, ${it.productId}, ${it.quantity}, ${it.unitPrice})
      `;
    }
  }

  async deleteByOrder(orderId, request = null) {
    const executor = request || sql;

    await executor.query`
      DELETE FROM OrderItem WHERE orderId = ${orderId}
    `;
  }
}

module.exports = new OrderItemDAO();

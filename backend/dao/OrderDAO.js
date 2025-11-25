// dao/OrderDAO.js
const { sql } = require('../config/db');

class OrderDAO {
  async getByUser(userId) {
    const r = await sql.query`
      SELECT o.*, a.*
      FROM Orders o
      JOIN Address a ON o.addressId = a.addressId
      WHERE o.userId = ${userId}
      ORDER BY o.createdAt DESC
    `;
    return r.recordset;
  }

  async getAll() {
    const r = await sql.query`
      SELECT o.*, u.username, u.email, a.*
      FROM Orders o
      JOIN Users u ON o.userId = u.userId
      JOIN Address a ON o.addressId = a.addressId
      ORDER BY o.createdAt DESC
    `;
    return r.recordset;
  }

  async getById(orderId) {
    const r = await sql.query`
      SELECT o.*, a.*
      FROM Orders o
      JOIN Address a ON o.addressId = a.addressId
      WHERE o.orderId = ${orderId}
    `;
    return r.recordset[0];
  }

  async getByTransactionCode(code) {
    const r = await sql.query`
      SELECT TOP 1 o.*, a.*, p.transactionCode
      FROM Orders o
      JOIN Payment p ON o.orderId = p.orderId
      JOIN Address a ON o.addressId = a.addressId
      WHERE p.transactionCode = ${code}
    `;
    return r.recordset[0];
  }

  async createOrder(order, items, transactionId) {
    const t = new sql.Transaction();

    try {
      await t.begin();
      const req = new sql.Request(t);

      // 1. Address
      const addr = await req.query`
        INSERT INTO Address (userId, fullName, phone, province, district, ward, detail, isDefault)
        OUTPUT INSERTED.addressId
        VALUES (
          ${order.userId},
          ${order.address.fullName},
          ${order.address.phone},
          ${order.address.province},
          ${order.address.district},
          ${order.address.ward},
          ${order.address.detail},
          0
        )
      `;
      const addressId = addr.recordset[0].addressId;

      // 2. Order
      const inserted = await req.query`
        INSERT INTO Orders (userId, addressId, totalPrice, orderStatus, paymentStatus, createdAt)
        OUTPUT INSERTED.orderId
        VALUES (
          ${order.userId},
          ${addressId},
          ${order.totalPrice},
          ${order.orderStatus},
          ${order.paymentStatus},
          GETDATE()
        )
      `;
      const orderId = inserted.recordset[0].orderId;

      // 3. OrderItem
      for (const it of items) {
        await req.query`
          INSERT INTO OrderItem (orderId, productId, quantity, unitPrice)
          VALUES (${orderId}, ${it.productId}, ${it.quantity}, ${it.unitPrice})
        `;
      }

      // 4. Payment
      if (transactionId) {
        await req.query`
          INSERT INTO Payment (orderId, method, amount, transactionCode)
          VALUES (${orderId}, 'Online', ${order.totalPrice}, ${transactionId})
        `;
      }

      await t.commit();
      return orderId;
    } catch (e) {
      await t.rollback();
      throw e;
    }
  }

  async updateStatus(orderId, status) {
    await sql.query`
      UPDATE Orders
      SET orderStatus = ${status}
      WHERE orderId = ${orderId}
    `;
  }

  async delete(orderId) {
    const t = new sql.Transaction();
    try {
      await t.begin();
      const req = new sql.Request(t);

      await req.query`DELETE FROM OrderItem WHERE orderId = ${orderId}`;
      await req.query`DELETE FROM Payment WHERE orderId = ${orderId}`;
      await req.query`DELETE FROM Shipment WHERE orderId = ${orderId}`;
      await req.query`DELETE FROM Orders WHERE orderId = ${orderId}`;

      await t.commit();
    } catch (e) {
      await t.rollback();
      throw e;
    }
  }
}

module.exports = new OrderDAO();

const { sql } = require('../config/db');

async function getByUser(userId) {
  const r = await sql.query`SELECT * FROM Orders WHERE userId = ${userId} ORDER BY createdAt DESC`;
  return r.recordset;
}

async function getItems(orderId) {
  const r = await sql.query`SELECT * FROM OrderItem WHERE orderId = ${orderId}`;
  return r.recordset;
}

async function create({ userId, totalPrice, fullName, phone, address, items }) {
  const transaction = new sql.Transaction();
  try {
    await transaction.begin();

    const req = new sql.Request(transaction);
    const inserted = await req.query(`
      INSERT INTO Orders (userId, totalPrice, fullName, phone, address, createdAt)
      OUTPUT INSERTED.orderId
      VALUES (${userId}, ${totalPrice}, N'${fullName}', '${phone}', N'${address}', GETDATE())
    `);
    const orderId = inserted.recordset[0].orderId;

    for (const item of items) {
      await transaction.request().query(`
        INSERT INTO OrderItem (orderId, productId, quantity, price, size, color)
        VALUES (${orderId}, ${item.productId}, ${item.quantity}, ${item.price}, N'${item.size}', N'${item.color}')
      `);
    }

    await transaction.commit();
    return orderId;
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
}

module.exports = { getByUser, getItems, create };

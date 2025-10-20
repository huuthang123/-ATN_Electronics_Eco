const { sql } = require('../config/db');

async function getByUser(userId) {
  const r = await sql.query(`
    SELECT ci.cartItemId, ci.productId, ci.quantity, ci.price, ci.attribute, ci.image, ci.categoryName
    FROM Cart c
    LEFT JOIN CartItem ci ON ci.cartId = c.cartId
    WHERE c.userId = ${userId}
  `);
  return r.recordset;
}

async function addItem({ userId, productId, quantity, price, attribute, image, categoryName }) {
  // Lấy giỏ hàng của user, tạo mới nếu chưa có
  const cartRes = await sql.query`SELECT cartId FROM Cart WHERE userId=${userId}`;
  let cartId;
  if (cartRes.recordset.length === 0) {
    const inserted = await sql.query`
      INSERT INTO Cart (userId, createdAt, updatedAt)
      OUTPUT INSERTED.cartId VALUES (${userId}, GETDATE(), GETDATE())
    `;
    cartId = inserted.recordset[0].cartId;
  } else {
    cartId = cartRes.recordset[0].cartId;
  }

  await sql.query`
    INSERT INTO CartItem (cartId, productId, quantity, price, attribute, image, categoryName)
    VALUES (${cartId}, ${productId}, ${quantity}, ${price}, ${attribute}, ${image}, ${categoryName})
  `;
}

async function clearCart(userId) {
  await sql.query`
    DELETE FROM CartItem WHERE cartId IN (SELECT cartId FROM Cart WHERE userId=${userId})
  `;
}

module.exports = { getByUser, addItem, clearCart };

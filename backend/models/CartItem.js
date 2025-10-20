const { sql } = require("../config/db");

async function getByCart(cartId) {
  const r = await sql.query`SELECT * FROM dbo.CartItem WHERE cartId = ${cartId}`;
  return r.recordset;
}

async function create({ cartId, productId, quantity }) {
  await sql.query`
    INSERT INTO dbo.CartItem (cartId, productId, quantity, createdAt, updatedAt)
    VALUES (${cartId}, ${productId}, ${quantity}, GETDATE(), GETDATE())
  `;
}

async function updateQuantity(cartItemId, quantity) {
  await sql.query`
    UPDATE dbo.CartItem SET quantity = ${quantity}, updatedAt = GETDATE()
    WHERE cartItemId = ${cartItemId}
  `;
}

async function deleteItem(cartItemId) {
  await sql.query`DELETE FROM dbo.CartItem WHERE cartItemId = ${cartItemId}`;
}

module.exports = { getByCart, create, updateQuantity, deleteItem };
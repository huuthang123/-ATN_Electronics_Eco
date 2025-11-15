const { sql } = require("../config/db");

class CartDAO {

  async getCartId(userId) {
    const result = await sql.query`
      SELECT cartId FROM Cart WHERE userId = ${userId}
    `;

    if (result.recordset.length === 0) {
      const created = await sql.query`
        INSERT INTO Cart (userId, createdAt)
        OUTPUT INSERTED.cartId
        VALUES (${userId}, GETDATE())
      `;
      return created.recordset[0].cartId;
    }

    return result.recordset[0].cartId;
  }

  async getItems(userId) {
  return sql.query`
    SELECT 
      ci.cartItemId,
      ci.cartId,
      ci.productId,
      ci.quantity,
      ci.price,
      p.name AS productName,
      p.image,
      c.name AS categoryName
    FROM CartItem ci
    JOIN Cart ca ON ci.cartId = ca.cartId
    JOIN Product p ON ci.productId = p.productId
    JOIN Category c ON p.categoryId = c.categoryId
    WHERE ca.userId = ${userId}
  `;
}


  async addItem({ cartId, productId, quantity, price }) {
    return sql.query`
      INSERT INTO CartItem (cartId, productId, quantity, price)
      VALUES (${cartId}, ${productId}, ${quantity}, ${price})
    `;
  }

  async updateQuantity(cartItemId, quantity) {
    return sql.query`
      UPDATE CartItem
      SET quantity = ${quantity}
      WHERE cartItemId = ${cartItemId}
    `;
  }

  async removeItem(cartItemId) {
    return sql.query`
      DELETE FROM CartItem
      WHERE cartItemId = ${cartItemId}
    `;
  }

  async clearCart(userId) {
    return sql.query`
      DELETE FROM CartItem
      WHERE cartId IN (SELECT cartId FROM Cart WHERE userId = ${userId})
    `;
  }
}

module.exports = new CartDAO();

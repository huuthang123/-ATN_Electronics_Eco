const CartDAO = require("../dao/CartDAO");
const CartItem = require("../models/CartItem");
const ProductDAO = require("../dao/ProductDAO");

class CartService {

  async getCart(userId) {
    const rows = await CartDAO.getItems(userId);
    return rows.recordset.map(r => new CartItem(r));
  }
  async getItems(userId) {
    return this.getCart(userId);
  }

  async addToCart(userId, { productId, quantity, price }) {

  // FIX: ProductDAO.getById() trả object, không phải recordset
  const product = await ProductDAO.getById(productId);
  if (!product) {
    throw new Error("Sản phẩm không tồn tại");
  }

  const cartId = await CartDAO.getCartId(userId);
  const items = await this.getCart(userId);

  const existing = items.find(i => i.productId == productId);

  if (existing) {
    await CartDAO.updateQuantity(existing.cartItemId, existing.quantity + quantity);
  } else {
    await CartDAO.addItem({
      cartId,
      productId,
      quantity,
      price
    });
  }

  return this.getCart(userId);
}


  async changeQuantity(userId, productId, change) {
    const items = await this.getCart(userId);
    const item = items.find(i => i.productId == productId);

    if (!item) throw new Error("Không tìm thấy sản phẩm trong giỏ");

    const newQty = item.quantity + change;

    if (newQty <= 0) {
      await CartDAO.removeItem(item.cartItemId);
    } else {
      await CartDAO.updateQuantity(item.cartItemId, newQty);
    }

    return this.getCart(userId);
  }

  async increaseQuantity(userId, productId) {
    return this.changeQuantity(userId, productId, +1);
  }

  async decreaseQuantity(userId, productId) {
    return this.changeQuantity(userId, productId, -1);
  }

  async removeFromCart(userId, productId) {
    const items = await this.getCart(userId);
    const item = items.find(i => i.productId == productId);

    if (!item) throw new Error("Không tìm thấy sản phẩm để xóa");

    await CartDAO.removeItem(item.cartItemId);
    return this.getCart(userId);
  }

  async clearCart(userId) {
    await CartDAO.clearCart(userId);
    return [];
  }
}

module.exports = new CartService();

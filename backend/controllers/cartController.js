const db = require('../models');
const Cart = db.Cart;
const CartItem = db.CartItem;
const Product = db.Product;

const isSameAttr = (a = {}, b = {}) => JSON.stringify(a) === JSON.stringify(b);

class CartController {
  // [GET] /api/cart
  static async getCart(req, res) {
    try {
      const userId = req.user.id;
      const cart = await Cart.findOne({
        where: { userId },
        include: [{ model: CartItem }],
      });
      res.json(cart || { userId, items: [] });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy giỏ hàng' });
    }
  }

  // [POST] /api/cart/add
  static async addToCart(req, res) {
    const t = await db.sequelize.transaction();
    try {
      const userId = req.user.id;
      const { productId, quantity, attributes, name, price, image, categoryName } = req.body;

      if (!productId || !quantity)
        return res.status(400).json({ message: 'Thiếu thông tin sản phẩm' });

      const product = await Product.findByPk(productId);
      if (!product)
        return res.status(404).json({ message: 'Sản phẩm không tồn tại' });

      const [cart] = await Cart.findOrCreate({ where: { userId }, defaults: { userId }, transaction: t });
      const items = await CartItem.findAll({ where: { cartId: cart.id, productId }, transaction: t });

      const existing = items.find(i => isSameAttr(i.attributes || {}, attributes));
      if (existing) {
        existing.quantity += quantity;
        await existing.save({ transaction: t });
      } else {
        await CartItem.create({
          cartId: cart.id,
          productId,
          quantity,
          attributes,
          name: name || product.name,
          price,
          image: image || product.image,
          categoryName: categoryName || '',
        }, { transaction: t });
      }

      await t.commit();
      const updated = await Cart.findOne({ where: { userId }, include: [{ model: CartItem }] });
      res.json(updated);
    } catch (error) {
      await t.rollback();
      res.status(500).json({ message: 'Lỗi khi thêm vào giỏ hàng', error: error.message });
    }
  }

  // [POST] /api/cart/:productId/increase
  static async increaseQuantity(req, res) {
    try {
      const userId = req.user.id;
      const { productId } = req.params;
      const { attributes } = req.body;

      const cart = await Cart.findOne({ where: { userId } });
      const item = await CartItem.findOne({ where: { cartId: cart.id, productId } });
      if (!item || !isSameAttr(item.attributes || {}, attributes))
        return res.status(404).json({ message: 'Sản phẩm không có trong giỏ hàng' });

      item.quantity += 1;
      await item.save();
      res.json(await Cart.findOne({ where: { userId }, include: [{ model: CartItem }] }));
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi tăng số lượng' });
    }
  }

  // [POST] /api/cart/:productId/decrease
  static async decreaseQuantity(req, res) {
    try {
      const userId = req.user.id;
      const { productId } = req.params;
      const { attributes } = req.body;

      const cart = await Cart.findOne({ where: { userId } });
      const item = await CartItem.findOne({ where: { cartId: cart.id, productId } });
      if (!item || !isSameAttr(item.attributes || {}, attributes))
        return res.status(404).json({ message: 'Sản phẩm không có trong giỏ hàng' });

      if (item.quantity > 1) item.quantity -= 1;
      else await item.destroy();

      await item.save();
      res.json(await Cart.findOne({ where: { userId }, include: [{ model: CartItem }] }));
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi giảm số lượng' });
    }
  }

  // [DELETE] /api/cart/:productId
  static async removeFromCart(req, res) {
    try {
      const userId = req.user.id;
      const { productId } = req.params;
      const { attributes } = req.body;

      const cart = await Cart.findOne({ where: { userId } });
      const item = await CartItem.findOne({ where: { cartId: cart.id, productId } });
      if (item && isSameAttr(item.attributes || {}, attributes))
        await item.destroy();

      res.json(await Cart.findOne({ where: { userId }, include: [{ model: CartItem }] }));
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi xóa sản phẩm' });
    }
  }
}

module.exports = CartController;

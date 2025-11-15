const CartService = require("../services/CartService");

class CartController {

  async getCart(req, res) {
    try {
      const userId = req.user.id;
      const items = await CartService.getItems(userId);

      return res.json({ items });
    } catch (err) {
      console.error("❌ getCart error:", err);
      res.status(500).json({ message: "Lỗi server", error: err.message });
    }
  }

  async addToCart(req, res) {
    try {
      const userId = req.user.id;
      const { productId, quantity, price } = req.body;

      // ✔ gọi đúng hàm
      await CartService.addToCart(userId, { productId, quantity, price });

      const items = await CartService.getItems(userId);
      res.json({ items });
    } catch (err) {
      console.error("❌ addToCart error:", err);
      res.status(500).json({ message: "Lỗi server", error: err.message });
    }
  }

  async increaseQuantity(req, res) {
    try {
      const userId = req.user.id;
      const productId = req.params.productId;

      await CartService.increaseQuantity(userId, productId);

      const items = await CartService.getItems(userId);
      res.json({ items });
    } catch (err) {
      console.error("❌ increaseQuantity error:", err);
      res.status(500).json({ message: "Lỗi server", error: err.message });
    }
  }

  async decreaseQuantity(req, res) {
    try {
      const userId = req.user.id;
      const productId = req.params.productId;

      await CartService.decreaseQuantity(userId, productId);

      const items = await CartService.getItems(userId);
      res.json({ items });
    } catch (err) {
      console.error("❌ decreaseQuantity error:", err);
      res.status(500).json({ message: "Lỗi server", error: err.message });
    }
  }

  async removeFromCart(req, res) {
    try {
      const userId = req.user.id;
      const productId = req.params.productId;

      // ❌ sai → CartService.removeItem
      // ✔ đúng:
      await CartService.removeFromCart(userId, productId);

      const items = await CartService.getItems(userId);
      res.json({ items });
    } catch (err) {
      console.error("❌ removeFromCart error:", err);
      res.status(500).json({ message: "Lỗi server", error: err.message });
    }
  }

  async clearCart(req, res) {
    try {
      const userId = req.user.id;

      await CartService.clearCart(userId);

      return res.json({ items: [] });
    } catch (err) {
      console.error("❌ clearCart error:", err);
      res.status(500).json({ message: "Lỗi server", error: err.message });
    }
  }
}

module.exports = new CartController();

const ProductService = require("../services/ProductService");
const { getRelatedProducts } = require("../services/RelatedProductService");

class ProductController {
  static async getProducts(req, res) {
    try {
      const products = await ProductService.getAll();
      res.json({ success: true, products });
    } catch (err) {
      console.error("getProducts error:", err);
      res.status(500).json({ message: err.message });
    }
  }

  static async getProductById(req, res) {
    try {
      const product = await ProductService.getById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Sản phẩm không tồn tại" });
      }
      res.json({ success: true, product });
    } catch (err) {
      console.error("getProductById error:", err);
      res.status(500).json({ message: err.message });
    }
  }

  static async getByCategory(req, res) {
    try {
      const { categoryId } = req.params;
      const products = await ProductService.getByCategory(categoryId);
      res.json({ success: true, products });
    } catch (err) {
      console.error("getByCategory error:", err);
      res.status(500).json({ message: err.message });
    }
  }

  static async addProduct(req, res) {
    try {
      const created = await ProductService.create(req.body);
      res.json({
        success: true,
        message: "Tạo sản phẩm thành công",
        productId: created?.productId
      });
    } catch (err) {
      console.error("addProduct error:", err);
      res.status(500).json({ message: err.message });
    }
  }

  static async updateProduct(req, res) {
    try {
      await ProductService.update(req.params.id, req.body);
      res.json({ success: true, message: "Cập nhật thành công" });
    } catch (err) {
      console.error("updateProduct error:", err);
      res.status(500).json({ message: err.message });
    }
  }

  static async deleteProduct(req, res) {
    try {
      const ok = await ProductService.delete(req.params.id);
      if (!ok) {
        return res.status(404).json({ message: "Không tồn tại" });
      }
      res.json({ success: true });
    } catch (err) {
      console.error("deleteProduct error:", err);
      res.status(500).json({ message: err.message });
    }
  }

  // ⭐⭐⭐ THÊM HÀM RELATED PRODUCT TẠI ĐÂY
  static async getRelatedProduct(req, res) {
  try {
    const productId = parseInt(req.params.id);
    const items = await getRelatedProducts(productId);
    res.json({ success: true, related: items });
  } catch (err) {
    console.error("getRelatedProduct error:", err);
    res.status(500).json({ message: err.message });
  }
}
}

module.exports = ProductController;

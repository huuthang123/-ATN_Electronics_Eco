const ProductImageService = require("../services/ProductImageService");

class ProductImageController {
  
  static async getByProduct(req, res) {
    try {
      const productId = req.params.productId;
      const images = await ProductImageService.getImages(productId);
      res.json({ success: true, images });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async create(req, res) {
    try {
      const { productId, imageUrl, color } = req.body;

      await ProductImageService.addImage({ productId, imageUrl, color });

      res.json({ success: true, message: "Thêm ảnh thành công" });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async update(req, res) {
    try {
      const imageId = req.params.imageId;
      const { imageUrl, color } = req.body;

      await ProductImageService.updateImage(imageId, { imageUrl, color });

      res.json({ success: true, message: "Cập nhật ảnh thành công" });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async delete(req, res) {
    try {
      const imageId = req.params.imageId;
      await ProductImageService.deleteImage(imageId);

      res.json({ success: true, message: "Xóa ảnh thành công" });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}

module.exports = ProductImageController;

const ProductAttributeValueService = require('../services/ProductAttributeValueService');

class ProductAttributeValueController {
  static async getByProduct(req, res) {
    try {
      const values = await ProductAttributeValueService.getByProduct(req.params.productId);
      res.json({ success: true, values });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async create(req, res) {
    try {
      await ProductAttributeValueService.addAttributeValue(req.body);
      res.status(201).json({ success: true, message: 'Created successfully' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}

module.exports = ProductAttributeValueController;

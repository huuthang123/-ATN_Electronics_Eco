const db = require('../models');
const Product = db.Product;
const Category = db.Category;
const { Op } = require('sequelize');
const axios = require('axios');

// Gọi API Python để lấy embedding từ văn bản
async function getEmbeddingFromPython(text) {
  const response = await axios.post('http://localhost:8000/embedding', { text });
  return response.data.embedding;
}

// Tính độ tương đồng cosine
function cosineSimilarity(vecA, vecB) {
  const dot = vecA.reduce((s, a, i) => s + a * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((s, a) => s + a * a, 0));
  const magB = Math.sqrt(vecB.reduce((s, b) => s + b * b, 0));
  if (!magA || !magB) return 0;
  return dot / (magA * magB);
}

class ProductController {
  // [POST] /api/products
  static async addProduct(req, res) {
    try {
      const { name, description, image, categoryId, prices, attributes, stock } = req.body;
      const embedding = await getEmbeddingFromPython(name || '');
      const product = await Product.create({
        name, description, image, categoryId, prices, attributes, stock, embedding,
      });
      res.status(201).json({ success: true, product });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // [POST] /api/products/bulk
  static async addProductsBulk(req, res) {
    try {
      const items = Array.isArray(req.body) ? req.body : [];
      const products = await Promise.all(items.map(async p => ({
        ...p, embedding: p.embedding || await getEmbeddingFromPython(p.name || ''),
      })));
      const created = await Product.bulkCreate(products, { returning: true });
      res.status(201).json({ success: true, products: created });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // [GET] /api/products
  static async getProducts(req, res) {
    try {
      const { categoryId } = req.query;
      const where = categoryId ? { categoryId } : undefined;
      const products = await Product.findAll({
        where,
        include: [{ model: Category, attributes: ['name'] }],
      });
      res.json({ success: true, products });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // [GET] /api/products/:id
  static async getProductById(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id, {
        include: [{ model: Category, attributes: ['name'] }],
      });
      if (!product)
        return res.status(404).json({ message: 'Sản phẩm không tồn tại!' });
      res.json({ success: true, product });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // [GET] /api/products/category/:category/id/:id
  static async getProductByCategoryAndId(req, res) {
    try {
      const { category, id } = req.params;
      const product = await Product.findByPk(id, {
        include: [{ model: Category, attributes: ['name'] }],
      });
      if (!product)
        return res.status(404).json({ message: 'Sản phẩm không tồn tại!' });

      const categoryName = product.Category?.name;
      if (categoryName && decodeURIComponent(category) !== categoryName)
        return res.status(400).json({ message: 'Danh mục không khớp với sản phẩm!' });

      res.json({ success: true, product });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // [GET] /api/products/search
  static async searchProducts(req, res) {
    try {
      const { keyword } = req.query;
      if (!keyword)
        return res.status(400).json({ message: 'Từ khoá không được để trống!' });
      const products = await Product.findAll({
        where: { name: { [Op.like]: `%${keyword}%` } },
        include: [{ model: Category, attributes: ['name'] }],
      });
      res.json({ success: true, products });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // [GET] /api/products/search-expanded
  static async searchExpandedProducts(req, res) {
    try {
      const { keyword } = req.query;
      if (!keyword)
        return res.status(400).json({ message: 'Từ khoá không được để trống!' });

      const main = await Product.findAll({
        where: { name: { [Op.like]: `%${keyword}%` } },
        include: [{ model: Category, attributes: ['name'] }],
      });

      const catIds = [...new Set(main.map(p => p.categoryId))];
      const related = await Product.findAll({
        where: {
          categoryId: { [Op.in]: catIds },
          name: { [Op.notLike]: `%${keyword}%` },
        },
        include: [{ model: Category, attributes: ['name'] }],
      });

      const unique = Array.from(new Map([...main, ...related].map(p => [p.id, p])).values());
      res.json({ success: true, products: unique });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // [GET] /api/products/search-embedding
  static async searchProductsByEmbedding(req, res) {
    try {
      const { keyword } = req.query;
      if (!keyword)
        return res.status(400).json({ message: 'Thiếu từ khóa' });

      const queryVec = await getEmbeddingFromPython(keyword);
      const products = await Product.findAll({
        include: [{ model: Category, attributes: ['name'] }],
      });

      const scored = products.map(p => ({
        product: p,
        score: cosineSimilarity(queryVec, p.embedding || []),
      }));
      scored.sort((a, b) => b.score - a.score);

      res.json({
        success: true,
        results: scored.slice(0, 10).map(({ product, score }) => ({
          id: product.id,
          name: product.name,
          image: product.image,
          prices: product.prices,
          category: product.Category?.name || '',
          score,
        })),
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // [PUT] /api/products/:id
  static async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const data = { ...req.body };
      if (data.name)
        data.embedding = await getEmbeddingFromPython(data.name);

      const [count] = await Product.update(data, { where: { id } });
      if (!count)
        return res.status(404).json({ message: 'Sản phẩm không tồn tại!' });

      const updated = await Product.findByPk(id);
      res.json({ success: true, product: updated });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // [DELETE] /api/products/:id
  static async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Product.destroy({ where: { id } });
      if (!deleted)
        return res.status(404).json({ message: 'Sản phẩm không tồn tại!' });

      res.json({ success: true, message: 'Xoá sản phẩm thành công!' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = ProductController;

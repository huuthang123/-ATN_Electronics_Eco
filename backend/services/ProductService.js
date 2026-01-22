const ProductDAO = require("../dao/ProductDAO");

class ProductService {

  // ---------------------------
  // GET ALL PRODUCTS
  // ---------------------------
  async getAll() {
    return await ProductDAO.getAll();   // ⭐ DAO đã trả recordset (mảng)
  }

  // ---------------------------
  // GET PRODUCT BY ID (FULL DETAIL)
  // ---------------------------
  async getById(id) {
    const product = await ProductDAO.getById(id);

    if (!product) return null; 
    return product;
  }

  // ---------------------------
  // GET BY CATEGORY
  // ---------------------------
  async getByCategory(categoryId) {
    const result = await ProductDAO.getByCategory(categoryId);
    return result.recordset; // getByCategory vẫn trả object → OK
  }

  // ---------------------------
  // CREATE PRODUCT
  // ---------------------------
  async create(data) {
    const result = await ProductDAO.create(data);
    return result.recordset ? result.recordset[0] : null;
  }

  // ---------------------------
  // UPDATE PRODUCT
  // ---------------------------
  async update(id, data) {
    return ProductDAO.update(id, data);
  }

  // ---------------------------
  // DELETE PRODUCT
  // ---------------------------
  async delete(id) {
    try {
      const result = await ProductDAO.delete(id);
      return result.rowsAffected && result.rowsAffected[0] > 0;
    } catch (err) {
      if (err.number === 547) {
        throw new Error(
          "Không thể xóa sản phẩm vì đang được sử dụng trong giỏ hàng, đơn hàng hoặc dữ liệu liên quan."
        );
      }
      throw err;
    }
  }
}

module.exports = new ProductService();

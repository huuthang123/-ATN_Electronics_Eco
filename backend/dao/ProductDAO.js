const { sql } = require("../config/db");

class ProductDAO {

  // ================================
  // GET ALL PRODUCTS (NO prices/images)
  // ================================
  async getAll() {
    return sql.query`
      SELECT p.*, c.name AS categoryName
      FROM Product p
      JOIN Category c ON p.categoryId = c.categoryId
      ORDER BY p.productId DESC
    `;
  }

  // ================================
  // GET PRODUCT BY ID (WITH prices + images)
  // ================================
  async getById(id) {
    // 1. Lấy thông tin sản phẩm
    const productRes = await sql.query`
      SELECT p.*, c.name AS categoryName
      FROM Product p
      JOIN Category c ON p.categoryId = c.categoryId
      WHERE p.productId = ${id}
    `;

    if (productRes.recordset.length === 0) return null;

    const product = productRes.recordset[0];

    // 2. Lấy giá (ProductPrice)
    const priceRes = await sql.query`
      SELECT priceId, productId, optionName, optionPrice, createdAt, updatedAt
      FROM ProductPrice
      WHERE productId = ${id}
      ORDER BY priceId ASC
    `;

    // 3. Lấy hình ảnh (ProductImage)
    const imageRes = await sql.query`
      SELECT imageId, productId, imageUrl, color, isPrimary
      FROM ProductImage
      WHERE productId = ${id}
      ORDER BY imageId ASC
    `;

    // 4. Gắn vào object để FE sử dụng
    return {
      ...product,
      productPrices: priceRes.recordset,
      productImages: imageRes.recordset
    };
  }

  // ================================
  // GET BY CATEGORY
  // ================================
  async getByCategory(categoryId) {
    return sql.query`
      SELECT p.*, c.name AS categoryName
      FROM Product p
      JOIN Category c ON p.categoryId = c.categoryId
      WHERE p.categoryId = ${categoryId}
      ORDER BY p.productId DESC
    `;
  }

  // ================================
  // GET PRODUCT PRICES ONLY
  // ================================
  async getPrices(productId) {
    return sql.query`
      SELECT priceId, productId, optionName, optionPrice, createdAt, updatedAt
      FROM ProductPrice
      WHERE productId = ${productId}
      ORDER BY priceId ASC
    `;
  }

  // ================================
  // GET PRODUCT IMAGES ONLY
  // ================================
  async getImages(productId) {
    return sql.query`
      SELECT imageId, productId, imageUrl, color, isPrimary, createdAt
      FROM ProductImage
      WHERE productId = ${productId}
      ORDER BY imageId ASC
    `;
  }

  // ================================
  // CREATE PRODUCT
  // ================================
  async create(data) {
    return sql.query`
      INSERT INTO Product (
        categoryId, name, description, image,
        stock, rating, sold, createdAt, updatedAt
      )
      VALUES (
        ${data.categoryId},
        ${data.name},
        ${data.description},
        ${data.image},
        ${data.stock ?? 0},
        ${data.rating ?? 0},
        ${data.sold ?? 0},
        GETDATE(),
        GETDATE()
      );

      SELECT SCOPE_IDENTITY() AS productId;
    `;
  }

  // ================================
  // UPDATE PRODUCT
  // ================================
  async update(productId, data) {
    const allowed = [
      "categoryId", "name", "description",
      "image", "stock", "rating", "sold"
    ];

    const updates = Object.entries(data).filter(([key]) =>
      allowed.includes(key)
    );

    if (!updates.length) return { rowsAffected: [0] };

    const req = new sql.Request();
    const setParts = [];

    updates.forEach(([key, value], idx) => {
      const param = `p${idx}`;
      req.input(param, value);
      setParts.push(`${key} = @${param}`);
    });

    req.input("productId", productId);

    const query = `
      UPDATE Product
      SET ${setParts.join(", ")}, updatedAt = GETDATE()
      WHERE productId = @productId
    `;

    return req.query(query);
  }

  // ================================
  // DELETE PRODUCT
  // ================================
  async delete(id) {
    return sql.query`
      DELETE FROM Product WHERE productId = ${id}
    `;
  }
}

module.exports = new ProductDAO();

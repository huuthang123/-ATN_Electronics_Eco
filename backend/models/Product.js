const { sql } = require('../config/db');

async function getAll() {
  const r = await sql.query(`
    SELECT p.*, c.name AS categoryName
    FROM Product p
    JOIN Category c ON p.categoryId = c.categoryId
    ORDER BY p.productId DESC
  `);
  return r.recordset;
}

async function getById(productId) {
  const r = await sql.query`SELECT * FROM Product WHERE productId = ${productId}`;
  return r.recordset[0];
}

async function create({ categoryId, name, description, image, stock = 0 }) {
  await sql.query`
    INSERT INTO Product (categoryId, name, description, image, stock, createdAt, updatedAt)
    VALUES (${categoryId}, ${name}, ${description}, ${image}, ${stock}, GETDATE(), GETDATE())
  `;
}

module.exports = { getAll, getById, create };

const { sql } = require('../config/db');

async function getAll() {
  const r = await sql.query`SELECT * FROM Category ORDER BY createdAt DESC`;
  return r.recordset;
}

async function create({ name, description, parentId = null }) {
  await sql.query`
    INSERT INTO Category (name, description, parentId, createdAt, updatedAt)
    VALUES (${name}, ${description}, ${parentId}, GETDATE(), GETDATE())
  `;
}

module.exports = { getAll, create };

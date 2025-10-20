const { sql } = require('../config/db');

async function getByUser(userId) {
  const r = await sql.query`SELECT * FROM Address WHERE userId = ${userId}`;
  return r.recordset;
}

async function create({ userId, fullName, phone, province, district, ward, detail }) {
  await sql.query`
    INSERT INTO Address (userId, fullName, phone, province, district, ward, detail, createdAt, updatedAt)
    VALUES (${userId}, ${fullName}, ${phone}, ${province}, ${district}, ${ward}, ${detail}, GETDATE(), GETDATE())
  `;
}

async function update(addressId, data) {
  const { fullName, phone, province, district, ward, detail } = data;
  await sql.query`
    UPDATE Address
    SET fullName=${fullName}, phone=${phone}, province=${province}, district=${district},
        ward=${ward}, detail=${detail}, updatedAt=GETDATE()
    WHERE addressId=${addressId}
  `;
}

module.exports = { getByUser, create, update };

const { sql } = require("../config/db");

class AddressDAO {
  getByUser(userId) {
    return sql.query`
      SELECT *
      FROM Address
      WHERE userId = ${userId}
      ORDER BY isDefault DESC, createdAt DESC
    `;
  }

  create({ userId, fullName, phone, province, district, ward, detail, isDefault }) {
    return sql.query`
      INSERT INTO Address (userId, fullName, phone, province, district, ward, detail, isDefault, createdAt)
      OUTPUT INSERTED.*
      VALUES (${userId}, ${fullName}, ${phone}, ${province}, ${district}, ${ward}, ${detail}, ${isDefault}, GETDATE())
    `;
  }

  update(addressId, userId, data) {
    return sql.query`
      UPDATE Address
      SET fullName = ${data.fullName},
          phone = ${data.phone},
          province = ${data.province},
          district = ${data.district},
          ward = ${data.ward},
          detail = ${data.detail},
          isDefault = ${data.isDefault}
      WHERE addressId = ${addressId} AND userId = ${userId}
    `;
  }

  delete(addressId, userId) {
    return sql.query`
      DELETE FROM Address
      WHERE addressId = ${addressId} AND userId = ${userId}
    `;
  }

  clearDefault(userId) {
    return sql.query`
      UPDATE Address
      SET isDefault = 0
      WHERE userId = ${userId}
    `;
  }
}

module.exports = new AddressDAO();

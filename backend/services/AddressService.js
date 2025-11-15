const AddressDAO = require("../dao/AddressDAO");
const Address = require("../models/Address");

class AddressService {
  async getByUser(userId) {
    const res = await AddressDAO.getByUser(userId);
    return res.recordset.map(row => new Address(row));
  }

  async create(userId, data) {
    if (data.isDefault) {
      await AddressDAO.clearDefault(userId);
    }

    const res = await AddressDAO.create({ userId, ...data });
    return new Address(res.recordset[0]);
  }

  async update(addressId, userId, data) {
    if (data.isDefault) {
      await AddressDAO.clearDefault(userId);
    }

    await AddressDAO.update(addressId, userId, data);
    return true;
  }

  async delete(addressId, userId) {
    await AddressDAO.delete(addressId, userId);
    return true;
  }
}

module.exports = new AddressService();

const AttributeDAO = require('../dao/AttributeDAO');
const Attribute = require('../models/Attribute');

class AttributeService {
  static async getAttributes(categoryId) {
    const rows = await AttributeDAO.getAll(categoryId);
    return rows.map(row => new Attribute(row));
  }

  static async getAttributeById(id) {
    const row = await AttributeDAO.getById(id);
    return row ? new Attribute(row) : null;
  }

  static async createAttribute(data) {
    return await AttributeDAO.create(data);
  }

  static async updateAttribute(id, data) {
    return await AttributeDAO.update(id, data);
  }

  static async deleteAttribute(id) {
    return await AttributeDAO.delete(id);
  }
}

module.exports = AttributeService;

class Attribute {
  constructor({ id, categoryId, name, valueType, createdAt, updatedAt }) {
    this.id = id;
    this.categoryId = categoryId;
    this.name = name;
    this.valueType = valueType;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

module.exports = Attribute;

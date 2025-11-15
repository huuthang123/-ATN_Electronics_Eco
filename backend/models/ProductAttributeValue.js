class ProductAttributeValue {
  constructor({ id, productId, attributeName, attributeValue }) {
    this.id = id;
    this.productId = productId;
    this.attributeName = attributeName;
    this.attributeValue = attributeValue;
  }
}

module.exports = ProductAttributeValue;

const { sql } = require("../config/db");

// Import models
const User = require("./User");
const Product = require("./Product");
const Category = require("./Category");
const Address = require("./Address");
const Cart = require("./Cart");
const CartItem = require("./CartItem");
const Order = require("./Order");
const OrderItem = require("./OrderItem");
const Review = require("./Review");
const ProductSummary = require("./ProductSummary");
const ProductAttributeValue = require("./ProductAttributeValue");
const Price = require("./Price"); // ✅ chính là ProductPrice
const Promotion = require("./Promotion"); // ✅ bạn đã có

module.exports = {
  sql,
  User,
  Product,
  Category,
  Address,
  Cart,
  CartItem,
  Order,
  OrderItem,
  Review,
  ProductSummary,
  ProductAttributeValue,
  Price,
  Promotion,
};

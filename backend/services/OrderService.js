// services/OrderService.js
const OrderDAO = require('../dao/OrderDAO');
const OrderItemService = require('./OrderItemService');

class OrderService {
  async getUserOrders(userId) {
    return OrderDAO.getByUser(userId);
  }

  async getAllOrders() {
    return OrderDAO.getAll();
  }

  async getById(id) {
    const order = await OrderDAO.getById(id);
    if (!order) return null;

    const items = await OrderItemService.getItems(id);
    return { order, items };
  }

  async createOrder({ userId, items, totalPrice, transactionId, address }) {
    const formattedItems = items.map((i) => ({
      productId: i.productId,
      quantity: i.quantity,
      unitPrice: i.unitPrice || i.price,
    }));

    const orderId = await OrderDAO.createOrder(
      {
        userId,
        totalPrice,
        address,
        orderStatus: 'Pending',
        paymentStatus: 'Unpaid',
      },
      formattedItems,
      transactionId
    );

    return orderId;
  }

  async deleteOrder(id) {
    return OrderDAO.delete(id);
  }

  async updateStatus(id, status) {
    return OrderDAO.updateStatus(id, status);
  }

  async getByTransactionCode(code) {
    const order = await OrderDAO.getByTransactionCode(code);
    if (!order) return null;

    const items = await OrderItemService.getItems(order.orderId);
    return { order, items };
  }
}

module.exports = new OrderService();

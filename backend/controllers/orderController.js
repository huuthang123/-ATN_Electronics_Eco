// controllers/orderController.js
const OrderService = require('../services/OrderService');

class OrderController {

  async getUserOrders(req, res) {
    try {
      const data = await OrderService.getUserOrders(req.user.userId);
      res.json(data);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }

  async getOrders(req, res) {
    try {
      const data = await OrderService.getAllOrders();
      res.json(data);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }

  async createOrder(req, res) {
    try {
      const userId = req.user.userId;

      const orderId = await OrderService.createOrder({
        userId,
        items: req.body.items,
        totalPrice: req.body.totalPrice,
        transactionId: req.body.transactionId,
        address: req.body.address
      });

      res.status(201).json({ 
        message: 'Tạo đơn hàng thành công', 
        orderId 
      });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }

  async deleteOrder(req, res) {
    try {
      await OrderService.deleteOrder(req.params.id);
      res.json({ message: 'Xoá đơn hàng thành công' });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }

  async updateOrderStatus(req, res) {
    try {
      await OrderService.updateStatus(req.params.id, req.body.status);
      res.json({ message: 'Cập nhật trạng thái thành công' });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }

  async getOrderByTransaction(req, res) {
    try {
      const result = await OrderService.getByTransactionCode(
        req.params.transactionNo
      );

      if (!result)
        return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });

      res.json(result);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
  async getRevenue(req, res) {
  try {
    const { startDate, endDate, groupBy } = req.query;
    const start = startDate || '2025-01-01';
    const end = endDate || new Date().toISOString().slice(0, 10);
    const formatStr = groupBy === 'day' ? "'yyyy-MM-dd'" : "'yyyy-MM'";

    const sqlQuery = `
      SELECT 
        FORMAT(createdAt, ${formatStr}) AS date,
        SUM(totalPrice) AS totalRevenue,
        COUNT(*) AS orderCount
      FROM Orders
      WHERE orderStatus = 'Delivered'
        AND createdAt BETWEEN '${start}' AND DATEADD(day, 1, '${end}')
      GROUP BY FORMAT(createdAt, ${formatStr})
      ORDER BY date ASC
    `;

    const result = await require('../config/db').sql.query(sqlQuery);
    res.json({ revenue: result.recordset });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
}

}

module.exports = new OrderController();

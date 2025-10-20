const db = require('../models');
const Order = db.Order;
const OrderItem = db.OrderItem;
const Product = db.Product;
const User = db.User;
const { QueryTypes } = require('sequelize');

class OrderController {
  // [GET] /api/orders/me
  static async getUserOrders(req, res) {
    try {
      const userId = req.user.id;
      const orders = await Order.findAll({
        where: { userId },
        include: [
          { model: User, attributes: ['username', 'email'] },
          { model: OrderItem, include: [{ model: Product, attributes: ['name', 'image'] }] },
        ],
        order: [['createdAt', 'DESC']],
      });
      if (!orders.length)
        return res.status(404).json({ message: 'Không tìm thấy đơn hàng nào' });
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  }

  // [GET] /api/orders
  static async getOrders(req, res) {
    try {
      const orders = await Order.findAll({
        include: [
          { model: User, attributes: ['username', 'email'] },
          { model: OrderItem, include: [{ model: Product, attributes: ['name', 'image'] }] },
        ],
        order: [['createdAt', 'DESC']],
      });
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  }

  // [POST] /api/orders
  static async createOrder(req, res) {
    const t = await db.sequelize.transaction();
    try {
      const userId = req.user.id;
      const { items, total, transactionId, address } = req.body;

      if (!Array.isArray(items) || !items.length)
        return res.status(400).json({ message: 'Danh sách sản phẩm không hợp lệ' });
      if (!total || isNaN(total) || total <= 0)
        return res.status(400).json({ message: 'Tổng tiền không hợp lệ' });
      if (!address || !address.fullName || !address.phone || !address.address)
        return res.status(400).json({ message: 'Địa chỉ giao hàng không đầy đủ' });

      const order = await Order.create(
        { userId, totalPrice: total, transactionId, address, status: 'Pending' },
        { transaction: t }
      );

      for (const item of items) {
        if (!item.productId || !item.quantity || !item.price)
          throw new Error('Dữ liệu sản phẩm không hợp lệ');

        await OrderItem.create(
          {
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            size: item.size || 'Default',
            color: item.color || 'Không xác định',
          },
          { transaction: t }
        );
      }

      await t.commit();
      res.status(201).json({ message: 'Tạo đơn hàng thành công', orderId: order.id });
    } catch (error) {
      await t.rollback();
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  }

  // [DELETE] /api/orders/:id
  static async deleteOrder(req, res) {
    const t = await db.sequelize.transaction();
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const order = await Order.findOne({ where: { id, userId }, transaction: t });
      if (!order)
        return res.status(404).json({ message: 'Đơn hàng không tồn tại hoặc không thuộc về bạn' });

      await OrderItem.destroy({ where: { orderId: id }, transaction: t });
      await order.destroy({ transaction: t });

      await t.commit();
      res.json({ message: 'Đơn hàng đã bị xóa' });
    } catch (error) {
      await t.rollback();
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  }

  // [PATCH] /api/orders/:id/status
  static async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const order = await Order.findByPk(id);
      if (!order)
        return res.status(404).json({ message: 'Đơn hàng không tồn tại' });

      if (order.userId !== req.user.id && req.user.role !== 'admin')
        return res.status(403).json({ message: 'Bạn không có quyền cập nhật đơn hàng này' });

      order.status = status;
      await order.save();
      res.json({ message: 'Cập nhật trạng thái thành công', order });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  }

  // [GET] /api/orders/transaction/:transactionNo
  static async getOrderByTransaction(req, res) {
    try {
      const transactionId = req.params.transactionNo;
      const order = await Order.findOne({
        where: { transactionId },
        include: [
          { model: User, attributes: ['username', 'email'] },
          { model: OrderItem, include: [{ model: Product, attributes: ['name', 'image'] }] },
        ],
      });
      if (!order)
        return res.status(404).json({ message: 'Không tìm thấy đơn hàng với mã giao dịch này' });

      const formatted = {
        items: order.OrderItems.map(oi => ({
          productId: oi.productId,
          name: oi.Product?.name,
          image: oi.Product?.image,
          quantity: oi.quantity,
          price: oi.price,
          size: oi.size,
          color: oi.color,
        })),
        total: order.totalPrice,
        address: order.address,
        transactionId: order.transactionId,
      };
      res.json(formatted);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  }

  // [GET] /api/orders/revenue?groupBy=day|month
  static async getRevenue(req, res) {
    try {
      const { startDate, endDate, groupBy } = req.query;
      const start = startDate || '2025-01-01';
      const end = endDate || new Date().toISOString().slice(0, 10);
      const sql = `
        SELECT 
          FORMAT(createdAt, ${groupBy === 'day' ? "'yyyy-MM-dd'" : "'yyyy-MM'"}) AS date,
          SUM(totalPrice) AS totalRevenue,
          COUNT(*) AS orderCount
        FROM Orders
        WHERE status = 'Delivered'
          AND createdAt BETWEEN :start AND DATEADD(day, 1, :end)
        GROUP BY FORMAT(createdAt, ${groupBy === 'day' ? "'yyyy-MM-dd'" : "'yyyy-MM'"})
        ORDER BY date ASC
      `;
      const data = await db.sequelize.query(sql, {
        replacements: { start, end },
        type: QueryTypes.SELECT,
      });
      res.json({ revenue: data });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  }
}

module.exports = OrderController;

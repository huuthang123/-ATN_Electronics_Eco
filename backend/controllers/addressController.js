const db = require('../models');
const Address = db.Address;

class AddressController {
  // [POST] /api/address
  static async addAddress(req, res) {
    try {
      const userId = req.user.id;
      const { fullName, phone, province, district, ward, detail } = req.body;

      if (!fullName || !phone || !province || !district || !ward || !detail)
        return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin địa chỉ' });

      const phoneRegex = /^0\\d{9}$/;
      if (!phoneRegex.test(phone))
        return res.status(400).json({ message: 'Số điện thoại phải bắt đầu bằng 0 và có đúng 10 chữ số' });

      const address = await Address.create({ userId, fullName, phone, province, district, ward, detail });
      res.status(201).json({ message: 'Địa chỉ đã được thêm!', address });
    } catch (error) {
      console.error('Lỗi khi thêm địa chỉ:', error);
      res.status(500).json({ message: 'Lỗi server!' });
    }
  }

  // [GET] /api/address
  static async getAddresses(req, res) {
    try {
      const userId = req.user.id;
      const addresses = await Address.findAll({ where: { userId }, order: [['createdAt', 'DESC']] });
      res.json(addresses);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server!' });
    }
  }

  // [PUT] /api/address/:addressId
  static async updateAddress(req, res) {
    try {
      const userId = req.user.id;
      const { addressId } = req.params;
      const { fullName, phone, province, district, ward, detail } = req.body;

      if (!fullName || !phone || !province || !district || !ward || !detail)
        return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin địa chỉ' });

      const phoneRegex = /^0\\d{9}$/;
      if (!phoneRegex.test(phone))
        return res.status(400).json({ message: 'Số điện thoại không hợp lệ' });

      const [count] = await Address.update(
        { fullName, phone, province, district, ward, detail },
        { where: { id: addressId, userId } }
      );

      if (!count)
        return res.status(404).json({ message: 'Địa chỉ không tồn tại hoặc không thuộc về bạn!' });

      const updated = await Address.findByPk(addressId);
      res.json({ message: 'Địa chỉ đã được cập nhật!', address: updated });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server!' });
    }
  }

  // [DELETE] /api/address/:addressId
  static async deleteAddress(req, res) {
    try {
      const userId = req.user.id;
      const { addressId } = req.params;
      const deleted = await Address.destroy({ where: { id: addressId, userId } });

      if (!deleted)
        return res.status(404).json({ message: 'Địa chỉ không tồn tại hoặc không thuộc về bạn!' });

      res.json({ message: 'Địa chỉ đã được xóa!' });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server!' });
    }
  }
}

module.exports = AddressController;

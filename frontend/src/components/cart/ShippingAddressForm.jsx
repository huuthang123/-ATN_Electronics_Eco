import React, { useState, useEffect } from 'react';
import axios from 'axios';
import addressApi from '../../services/addressApi'; 
import { useAuth } from '../../context/AuthContext';
import '../../styles/ShippingAddressForm.css';

function ShippingAddressForm({ onAddressSelect, onAddressAdded, onClose, initialData, isAddingNew }) {
  const { user, logout } = useAuth();

  const [formData, setFormData] = useState({
    province: '',
    district: '',
    ward: '',
    detail: '',
    fullName: '',
    phone: '',
  });

  const [errors, setErrors] = useState({});
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [loading, setLoading] = useState({ provinces: false, districts: false, wards: false, form: false });

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [editingAddress, setEditingAddress] = useState(null);

  // ===============================
  // 🔹 Load danh sách địa chỉ người dùng
  // ===============================
  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user?.token) return;

      try {
        setLoading(prev => ({ ...prev, form: true }));

        const addresses = await addressApi.getAddresses(user.token);
        setSavedAddresses(addresses);

        if (addresses.length > 0 && !initialData && !isAddingNew) {
          const defaultAddress = addresses[0];
          setSelectedAddressId(defaultAddress.addressId);

          onAddressSelect({
            addressId: defaultAddress.addressId,
            fullName: defaultAddress.fullName,
            address: `${defaultAddress.detail}, ${defaultAddress.ward}, ${defaultAddress.district}, ${defaultAddress.province}`,
            phone: defaultAddress.phone,
          });
        }
      } catch (error) {
        console.error('Lỗi lấy địa chỉ:', error);
      } finally {
        setLoading(prev => ({ ...prev, form: false }));
      }
    };

    fetchAddresses();
  }, [user?.token, onAddressSelect, initialData, isAddingNew]);

  // ===============================
  // 🔹 Nếu đang sửa → fill form
  // ===============================
  useEffect(() => {
    if (initialData) {
      setFormData({
        province: initialData.province || '',
        district: initialData.district || '',
        ward: initialData.ward || '',
        detail: initialData.detail || '',
        fullName: initialData.fullName || '',
        phone: initialData.phone || '',
      });

      setSelectedAddressId(initialData.addressId);
    } else {
      setFormData({ province: '', district: '', ward: '', detail: '', fullName: '', phone: '' });
    }
  }, [initialData]);

  // ===============================
  // 🔹 API của Việt Nam để load tỉnh / huyện / xã
  // ===============================
  useEffect(() => {
    const loadProvinces = async () => {
      try {
        setLoading(prev => ({ ...prev, provinces: true }));
        const response = await axios.get('https://provinces.open-api.vn/api/p/');
        setProvinces(response.data);
      } catch (err) {
        setErrors(prev => ({ ...prev, form: 'Không tải được tỉnh/thành phố.' }));
      } finally {
        setLoading(prev => ({ ...prev, provinces: false }));
      }
    };

    loadProvinces();
  }, []);

  useEffect(() => {
    if (!formData.province) return setDistricts([]);

    const loadDistricts = async () => {
      try {
        setLoading(prev => ({ ...prev, districts: true }));
        const res = await axios.get(`https://provinces.open-api.vn/api/p/${formData.province}?depth=2`);
        setDistricts(res.data.districts || []);
        setFormData(prev => ({ ...prev, district: '', ward: '' }));
      } catch {
        setErrors(prev => ({ ...prev, form: 'Không tải được quận/huyện.' }));
      } finally {
        setLoading(prev => ({ ...prev, districts: false }));
      }
    };

    loadDistricts();
  }, [formData.province]);

  useEffect(() => {
    if (!formData.district) return setWards([]);

    const loadWards = async () => {
      try {
        setLoading(prev => ({ ...prev, wards: true }));
        const res = await axios.get(`https://provinces.open-api.vn/api/d/${formData.district}?depth=2`);
        setWards(res.data.wards || []);
        setFormData(prev => ({ ...prev, ward: '' }));
      } catch {
        setErrors(prev => ({ ...prev, form: 'Không tải được phường/xã.' }));
      } finally {
        setLoading(prev => ({ ...prev, wards: false }));
      }
    };

    loadWards();
  }, [formData.district]);

  // ===============================
  // 🔹 Validate form
  // ===============================
  const validate = (data) => {
    const errors = {};
    if (!data.fullName.trim()) errors.fullName = 'Họ và tên không được trống.';
    else if (/\d/.test(data.fullName)) errors.fullName = 'Tên không được chứa số';

    const phoneRegex = /^0\d{9}$/;
    if (!data.phone) errors.phone = 'Không được trống.';
    else if (!phoneRegex.test(data.phone)) errors.phone = 'SĐT phải 10 số và bắt đầu bằng 0';

    if (!data.province) errors.province = 'Chọn tỉnh';
    if (!data.district) errors.district = 'Chọn huyện';
    if (!data.ward) errors.ward = 'Chọn xã';
    if (!data.detail.trim()) errors.detail = 'Nhập địa chỉ chi tiết';

    return errors;
  };

  const handleInputChange = (field, value) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    setErrors(validate(newData));
  };

  // ===============================
  // 🔹 Chọn địa chỉ đã lưu
  // ===============================
  const handleSelectAddress = (address) => {
    setSelectedAddressId(address.addressId);

    onAddressSelect({
      addressId: address.addressId,
      fullName: address.fullName,
      address: `${address.detail}, ${address.ward}, ${address.district}, ${address.province}`,
      phone: address.phone,
    });

    onClose();
  };

  // ===============================
  // 🔹 Xóa địa chỉ
  // ===============================
  const handleDeleteAddress = async (addressId) => {
    try {
      setLoading(prev => ({ ...prev, form: true }));

      await addressApi.deleteAddress(addressId, user.token);

      const updated = await addressApi.getAddresses(user.token);
      setSavedAddresses(updated);
      setShowDeleteConfirm(null);

      if (selectedAddressId === addressId && updated.length > 0) {
        handleSelectAddress(updated[0]);
      } else if (updated.length === 0) {
        setSelectedAddressId(null);
      }
    } catch (err) {
      setErrors({ form: err.message });
    } finally {
      setLoading(prev => ({ ...prev, form: false }));
    }
  };

  // ===============================
  // 🔹 Submit form (THÊM hoặc SỬA)
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errs = validate(formData);
    if (Object.keys(errs).length > 0) return setErrors(errs);

    const provinceName = provinces.find(p => p.code === Number(formData.province))?.name;
    const districtName = districts.find(d => d.code === Number(formData.district))?.name;
    const wardName = wards.find(w => w.code === Number(formData.ward))?.name;

    const data = {
      fullName: formData.fullName,
      phone: formData.phone,
      province: provinceName,
      district: districtName,
      ward: wardName,
      detail: formData.detail,
    };

    try {
      setLoading(prev => ({ ...prev, form: true }));

      let result;

      if (editingAddress || initialData) {
        const id = editingAddress?.addressId || initialData?.addressId;
        await addressApi.updateAddress(id, data, user.token);
      } else {
        result = await addressApi.addAddress(data, user.token);
        if (onAddressAdded) onAddressAdded(result);
      }

      const refreshed = await addressApi.getAddresses(user.token);
      setSavedAddresses(refreshed);

      setFormData({ province: '', district: '', ward: '', detail: '', fullName: '', phone: '' });
      setEditingAddress(null);
      setDistricts([]);
      setWards([]);

      onClose();
    } catch (err) {
      setErrors({ form: err.message });
      if (err.response?.status === 401) logout();
    } finally {
      setLoading(prev => ({ ...prev, form: false }));
    }
  };

  // ===============================
  // 🔹 Nếu chưa login
  // ===============================
  if (!user?.token) {
    return (
      <div className="shipping-address-modal" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Địa chỉ giao hàng</h3>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
          <div className="modal-body">
            <p className="form-error">Vui lòng đăng nhập để quản lý địa chỉ.</p>
          </div>
        </div>
      </div>
    );
  }

  // ===============================
  // 🔹 UI chính (KHÔNG đổi CSS)
  // ===============================
  return (
    <div className="shipping-address-modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Quản lý địa chỉ giao hàng</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className={`loading-overlay ${(loading.provinces || loading.districts || loading.wards || loading.form) ? 'loading' : ''}`}>
            <p>Đang tải...</p>
          </div>

          {/* ====================== Danh sách địa chỉ lưu ===================== */}
          {savedAddresses.length > 0 && !isAddingNew && (
            <div className="saved-addresses-section">
              <h4>Địa chỉ đã lưu</h4>
              <div className="saved-addresses">
                {savedAddresses.map((address) => (
                  <div
                    key={address.addressId}
                    className={`address-item ${selectedAddressId === address.addressId ? 'selected' : ''}`}
                  >
                    <div className="address-content" onClick={() => handleSelectAddress(address)}>
                      <p>
                        <strong>{address.fullName}</strong> ({address.phone})
                      </p>
                      <p>{`${address.detail}, ${address.ward}, ${address.district}, ${address.province}`}</p>
                    </div>

                    <div className="address-actions">
                      <button
                        className="edit-btn"
                        onClick={() => {
                          setEditingAddress(address);
                          setFormData({
                            province: address.province,
                            district: address.district,
                            ward: address.ward,
                            detail: address.detail,
                            fullName: address.fullName,
                            phone: address.phone,
                          });
                        }}
                        disabled={loading.form}
                      >
                        ✏️
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => setShowDeleteConfirm(address.addressId)}
                        disabled={loading.form}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ====================== Form nhập địa chỉ ===================== */}
          <div className="form-section">
            <h4>{editingAddress || initialData ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ mới'}</h4>

            <form onSubmit={handleSubmit} className="address-form">

              {/* Họ tên - SĐT */}
              <div className="form-row">
                <div className="form-group">
                  <label>Họ và tên:</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className={errors.fullName ? 'input-error' : ''}
                  />
                  {errors.fullName && <p className="error-message">{errors.fullName}</p>}
                </div>

                <div className="form-group">
                  <label>Số điện thoại:</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={errors.phone ? 'input-error' : ''}
                  />
                  {errors.phone && <p className="error-message">{errors.phone}</p>}
                </div>
              </div>

              {/* Tỉnh - huyện */}
              <div className="form-row">
                <div className="form-group">
                  <label>Tỉnh/Thành phố:</label>
                  <select
                    value={formData.province}
                    onChange={(e) => handleInputChange('province', e.target.value)}
                    className={errors.province ? 'input-error' : ''}
                  >
                    <option value="">-- Chọn --</option>
                    {provinces.map((p) => (
                      <option key={p.code} value={p.code}>{p.name}</option>
                    ))}
                  </select>
                  {errors.province && <p className="error-message">{errors.province}</p>}
                </div>

                <div className="form-group">
                  <label>Quận/Huyện:</label>
                  <select
                    value={formData.district}
                    onChange={(e) => handleInputChange('district', e.target.value)}
                    disabled={!formData.province}
                    className={errors.district ? 'input-error' : ''}
                  >
                    <option value="">-- Chọn --</option>
                    {districts.map((d) => (
                      <option key={d.code} value={d.code}>{d.name}</option>
                    ))}
                  </select>
                  {errors.district && <p className="error-message">{errors.district}</p>}
                </div>
              </div>

              {/* Xã - chi tiết */}
              <div className="form-row">
                <div className="form-group">
                  <label>Phường/Xã:</label>
                  <select
                    value={formData.ward}
                    onChange={(e) => handleInputChange('ward', e.target.value)}
                    disabled={!formData.district}
                    className={errors.ward ? 'input-error' : ''}
                  >
                    <option value="">-- Chọn --</option>
                    {wards.map((w) => (
                      <option key={w.code} value={w.code}>{w.name}</option>
                    ))}
                  </select>
                  {errors.ward && <p className="error-message">{errors.ward}</p>}
                </div>

                <div className="form-group">
                  <label>Địa chỉ chi tiết:</label>
                  <input
                    type="text"
                    value={formData.detail}
                    onChange={(e) => handleInputChange('detail', e.target.value)}
                    className={errors.detail ? 'input-error' : ''}
                    placeholder="Số nhà, đường..."
                  />
                  {errors.detail && <p className="error-message">{errors.detail}</p>}
                </div>
              </div>

              {errors.form && <p className="form-error">{errors.form}</p>}

              <div className="form-buttons">
                <button className="submit-btn" disabled={loading.form}>
                  {loading.form ? 'Đang lưu...' : editingAddress ? 'Cập nhật' : 'Thêm mới'}
                </button>

                <button type="button" className="cancel-btn" onClick={onClose} disabled={loading.form}>
                  Hủy
                </button>
              </div>
            </form>
          </div>

          {/* ====================== Confirm Xóa ===================== */}
          {showDeleteConfirm && (
            <div className="confirm-modal">
              <div className="confirm-content">
                <h4>Xác nhận xóa</h4>
                <p>Bạn có chắc muốn xóa địa chỉ này?</p>

                <div className="confirm-buttons">
                  <button
                    className="confirm-delete-btn"
                    onClick={() => handleDeleteAddress(showDeleteConfirm)}
                  >
                    Xóa
                  </button>
                  <button
                    className="cancel-delete-btn"
                    onClick={() => setShowDeleteConfirm(null)}
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default ShippingAddressForm;

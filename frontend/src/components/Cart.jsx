import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import ShippingAddressForm from "./ShippingAddressForm";
import "../styles/Cart.css";

const Cart = () => {
  const {
    cartItems,
    total,
    totalItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    selectAll,
    toggleItemSelection,
  } = useCart();

  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [error, setError] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setIsAddingNew(false);
  };

  const handleCheckout = () => {
    if (total <= 0) {
      setError("Giỏ hàng của bạn trống hoặc chưa chọn sản phẩm nào!");
      return;
    }
    if (!selectedAddress) {
      setError("Vui lòng chọn hoặc thêm địa chỉ giao hàng để tiếp tục!");
      return;
    }
    const selectedItems = cartItems.filter((item) => item.selected);
    if (selectedItems.length === 0) {
      setError("Vui lòng chọn ít nhất một sản phẩm để thanh toán!");
      return;
    }
    navigate("/payment", {
      state: { selectedAddress, selectedItems, total },
    });
  };

  const handleViewProduct = (productId, categoryName) => {
    const productPath = categoryName
      ? `/${categoryName}/${productId}`
      : `/product/${productId}`;
    navigate(productPath);
  };

  const handleSelectAllChange = (e) => {
    selectAll(e.target.checked);
  };

  return (
    <div className="cart-container">
      <div className="cart-header">
        <div className="shop-logo">
          <h1>Hương Việt Tinh</h1>
          <p>Giỏ Hàng ({totalItems} sản phẩm)</p>
        </div>
      </div>

      <div className="address-section">
        <h3>Địa chỉ giao hàng</h3>
        {error && <p className="error-message">{error}</p>}
        {selectedAddress && !isAddingNew ? (
          <div className="selected-address">
            <p>
              <strong>{selectedAddress.fullName}</strong> ({selectedAddress.phone})
            </p>
            <p>{selectedAddress.address}</p>
            <button
              className="change-address-btn"
              onClick={() => setIsAddingNew(true)}
            >
              Thay đổi địa chỉ
            </button>
          </div>
        ) : (
          <ShippingAddressForm
            onAddressSelect={handleAddressSelect}
            onClose={() => setIsAddingNew(false)}
            initialData={selectedAddress}
            isAddingNew={isAddingNew}
          />
        )}
        {selectedAddress && !isAddingNew && (
          <button
            className="add-address-btn"
            onClick={() => setIsAddingNew(true)}
          >
            Thêm địa chỉ mới
          </button>
        )}
      </div>

      <div className="cart-items">
        <div className="cart-item-header">
          <input
            type="checkbox"
            onChange={handleSelectAllChange}
            checked={
              cartItems.length > 0 && cartItems.every((item) => item.selected)
            }
          />
          <span>Sản Phẩm</span>
          <span>Phân Loại Hàng</span>
          <span>Đơn Giá</span>
          <span>Số Lượng</span>
          <span>Số Tiền</span>
          <span>Thao Tác</span>
        </div>

        {Array.isArray(cartItems) && cartItems.length === 0 ? (
          <p className="empty-cart">Giỏ hàng của bạn đang trống.</p>
        ) : (
          cartItems.map((item) => {
            const categoryName = item.categoryId?.name || "Đang cập nhật";
            const size = item.attributes?.size || '250';

            return (
              <div
                key={`${item.productId}-${JSON.stringify(item.attributes)}`}
                className="cart-item"
              >
                <input
                  type="checkbox"
                  checked={item.selected}
                  onChange={(e) => {
                    e.stopPropagation();
                    toggleItemSelection(item.productId, item.attributes || { size: '250' });
                  }}
                />
                <div
                  className="cart-item-details"
                  onClick={() => handleViewProduct(item.productId, categoryName)}
                  style={{ cursor: "pointer" }}
                >
                  <img src={item.image} alt={item.name} className="cart-item-image" />
                  <div className="cart-item-info">
                    <p>{item.name}</p>
                  </div>
                </div>
                <div className="cart-item-classification">
                  {categoryName}, {size}
                </div>
                <div className="cart-item-price">{item.price.toLocaleString()}đ</div>
                <div className="cart-item-quantity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      decreaseQuantity(item.productId, item.attributes || { size: '250' });
                    }}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      increaseQuantity(item.productId, item.attributes || { size: '250' });
                    }}
                  >
                    +
                  </button>
                </div>
                <div className="cart-item-total">
                  {(item.price * item.quantity).toLocaleString()}đ
                </div>
                <div className="cart-item-actions">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromCart(item.productId, item.attributes || { size: '250' });
                    }}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="cart-summary">
        <div className="summary-details">
          <p>
            Tổng thanh toán ({cartItems.filter((item) => item.selected).length} sản phẩm): {" "}
            <span>{total.toLocaleString()}đ</span>
          </p>
        </div>
        <button
          className="checkout-btn"
          onClick={handleCheckout}
          disabled={total === 0 || !selectedAddress}
        >
          Đặt Hàng
        </button>
      </div>
    </div>
  );
};

export default Cart;

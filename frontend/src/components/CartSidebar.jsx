import React, { useEffect } from "react";
import "../styles/cartsidebar.css";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import CartItemInfo from "./CartItemInfo";

function CartSidebar() {
  const {
    cartItems,
    removeFromCart,
    isOpen,
    toggleCart,
    increaseQuantity,
    decreaseQuantity,
    fetchCartFromServer,
    loadCartFromLocalStorage,
    displayAttributes,
  } = useCart();

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const initializeCart = async () => {
      if (user?.token) {
        try {
          await fetchCartFromServer();
        } catch (error) {
          if (error.response?.status === 401) {
            logout();
            navigate("/sign-in");
          } else {
            loadCartFromLocalStorage();
          }
        }
      } else {
        loadCartFromLocalStorage();
      }
    };

    initializeCart();
  }, [user, fetchCartFromServer, loadCartFromLocalStorage, logout, navigate]);

  const handleViewCart = () => navigate("/cart");

  const handleViewProduct = (productId, categoryName) => {
    const path = categoryName
      ? `/product/${encodeURIComponent(categoryName)}/${productId}`
      : `/product/unknown/${productId}`;
    navigate(path);
  };

  const numberOfItems = cartItems.length;

  return (
    <>
      <div className="cart-toggle-btn" onClick={toggleCart}>
        <i className="fas fa-shopping-cart"></i>
        <span className="cart-count-badge">{numberOfItems}</span>
      </div>

      <div id="cart-sidebar" className={isOpen ? "open" : "closed"}>
        <div className="cart-header">
          <h2>⚡ Giỏ hàng TechStore</h2>
          <button className="close-btn" onClick={toggleCart}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="cart-actions">
          <p id="cart-count">Số lượng mặt hàng: {numberOfItems}</p>
        </div>

        <ul id="cart-items">
          {cartItems.map((item) => {
            const categoryName = item.categoryName || "Đang cập nhật";

            return (
              <li
                key={`${item.productId}-${JSON.stringify(item.attributes)}`}
                className="cart-item"
              >
                <div
                  className="cart-item-details"
                  onClick={() =>
                    handleViewProduct(item.productId, categoryName)
                  }
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-item-image"
                    onError={(e) => {
                      e.target.src = "/placeholder.png";
                      e.target.onerror = null;
                    }}
                  />

                  <div className="cart-item-info">
                    <span>
                      <CartItemInfo
                        productId={item.productId}
                        fallbackName={item.name || "Tên sản phẩm"}
                      />

                      {item.attributes &&
                        Object.keys(item.attributes).length > 0 && (
                          <span className="attributes">
                            ({displayAttributes(item.attributes)})
                          </span>
                        )}
                    </span>

                    <span>
                      {typeof item.price === "number"
                        ? `${item.price.toLocaleString()} VND`
                        : "Chưa có giá"}
                    </span>

                    <div className="quantity-controls">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          decreaseQuantity(item.productId, item.attributes);
                        }}
                      >
                        -
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          increaseQuantity(item.productId, item.attributes);
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() =>
                    removeFromCart(item.productId, item.attributes)
                  }
                >
                  Xóa
                </button>
              </li>
            );
          })}
        </ul>

        <div className="cart-footer">
          <button id="view-cart-btn" onClick={handleViewCart}>
            Xem giỏ hàng
          </button>
        </div>
      </div>
    </>
  );
}

export default CartSidebar;

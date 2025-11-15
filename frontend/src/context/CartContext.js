import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";

import {
  fetchCart as apiFetchCart,
  addToCart as apiAddToCart,
  increaseQuantity as apiIncreaseQuantity,
  decreaseQuantity as apiDecreaseQuantity,
  removeFromCart as apiRemoveFromCart,
} from "../services/cartApi";

import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user, logout } = useAuth();

  const [cartItems, setCartItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // 🧮 Tổng tiền và tổng số lượng (chỉ tính sản phẩm selected)
  const total = useMemo(
    () =>
      cartItems
        .filter((item) => item.selected)
        .reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  const totalItems = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  // 🧩 Load giỏ hàng từ localStorage cho khách
  const loadCartFromLocalStorage = useCallback(() => {
    try {
      const stored = localStorage.getItem("cartItems");
      if (stored) {
        const parsed = JSON.parse(stored);
        // đảm bảo luôn có selected
        setCartItems(
          parsed.map((i) => ({
            ...i,
            selected: i.selected !== undefined ? i.selected : true,
          }))
        );
      } else {
        setCartItems([]);
      }
    } catch (err) {
      console.error("Lỗi load cart từ localStorage:", err);
      setCartItems([]);
    }
  }, []);

  // 🧩 Load giỏ hàng từ server cho user đã login
  const fetchCartFromServer = useCallback(async () => {
    if (!user?.token) return;
    try {
      const items = await apiFetchCart(user.token);
      setCartItems(
        (items || []).map((i) => ({
          ...i,
          selected: i.selected !== undefined ? i.selected : true,
        }))
      );
    } catch (error) {
      console.error("Lỗi lấy giỏ hàng từ server:", error);
      if (error.response?.status === 401) {
        // token hết hạn / sai → logout
        logout();
        loadCartFromLocalStorage();
      }
    }
  }, [user?.token, logout, loadCartFromLocalStorage]);

  // 🔁 Khi user thay đổi (login / logout) → load cart tương ứng
  useEffect(() => {
    if (user?.token) {
      fetchCartFromServer();
    } else {
      loadCartFromLocalStorage();
    }
  }, [user, fetchCartFromServer, loadCartFromLocalStorage]);

  // 🛒 Thêm vào giỏ hàng
  const handleAddToCart = async (product) => {
    console.log("🛒 handleAddToCart:", product);

    if (user?.token) {
      try {
        const items = await apiAddToCart(product, user.token);
        setCartItems(
          (items || []).map((i) => ({
            ...i,
            selected: i.selected !== undefined ? i.selected : true,
          }))
        );
      } catch (error) {
        console.error("Lỗi khi thêm vào cart (server):", error);
        alert(error.message || "Không thể thêm sản phẩm vào giỏ hàng");
      }
    } else {
      // khách: lưu localStorage
      setCartItems((prev) => {
        const existing = prev.find((i) => i.productId === product.productId);
        let updated;

        if (existing) {
          updated = prev.map((i) =>
            i.productId === product.productId
              ? { ...i, quantity: i.quantity + (product.quantity || 1) }
              : i
          );
        } else {
          updated = [
            ...prev,
            {
              productId: product.productId,
              name: product.name,
              price: product.price,
              image: product.image,
              quantity: product.quantity || 1,
              selected: true,
            },
          ];
        }

        localStorage.setItem("cartItems", JSON.stringify(updated));
        return updated;
      });
    }
  };

  // 🔄 Tăng số lượng (dùng productId, bỏ attributes)
  const handleIncreaseQuantity = async (productId) => {
    console.log("🔄 handleIncreaseQuantity called with:", {
      productId,
      hasToken: !!user?.token,
    });

    if (user?.token) {
      try {
        await apiIncreaseQuantity(productId, user.token);
        await fetchCartFromServer();
      } catch (error) {
        console.error("❌ Lỗi khi tăng số lượng:", error);
        alert(error.message || "Không thể tăng số lượng");
      }
    } else {
      setCartItems((prev) => {
        const updated = prev.map((i) =>
          i.productId === productId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
        localStorage.setItem("cartItems", JSON.stringify(updated));
        return updated;
      });
    }
  };

  // 🔄 Giảm số lượng
  const handleDecreaseQuantity = async (productId) => {
    console.log("🔄 handleDecreaseQuantity called with:", {
      productId,
      hasToken: !!user?.token,
    });

    if (user?.token) {
      try {
        await apiDecreaseQuantity(productId, user.token);
        await fetchCartFromServer();
      } catch (error) {
        console.error("❌ Lỗi khi giảm số lượng:", error);
        alert(error.message || "Không thể giảm số lượng");
      }
    } else {
      setCartItems((prev) => {
        const updated = prev
          .map((i) =>
            i.productId === productId && i.quantity > 1
              ? { ...i, quantity: i.quantity - 1 }
              : i
          )
          .filter((i) => i.quantity > 0);

        localStorage.setItem("cartItems", JSON.stringify(updated));
        return updated;
      });
    }
  };

  // ❌ Xóa sản phẩm khỏi giỏ
  const handleRemoveFromCart = async (productId) => {
    console.log("🗑 handleRemoveFromCart called with:", {
      productId,
      hasToken: !!user?.token,
    });

    if (user?.token) {
      try {
        await apiRemoveFromCart(productId, user.token);
        await fetchCartFromServer();
      } catch (error) {
        console.error("❌ Lỗi khi xóa khỏi giỏ hàng:", error);
        alert(error.message || "Không thể xóa sản phẩm khỏi giỏ hàng");
      }
    } else {
      setCartItems((prev) => {
        const updated = prev.filter((i) => i.productId !== productId);
        localStorage.setItem("cartItems", JSON.stringify(updated));
        return updated;
      });
    }
  };

  // ✅ Chọn / bỏ chọn tất cả sản phẩm
  const selectAll = (checked) => {
    setCartItems((prev) =>
      prev.map((item) => ({
        ...item,
        selected: checked,
      }))
    );
  };

  // ✅ Chọn / bỏ chọn 1 sản phẩm
  const toggleItemSelection = (productId /*, attributes */) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, selected: !item.selected }
          : item
      )
    );
  };

  // 👁 Hiển thị attributes cho UI (sidebar)
  const displayAttributes = (attributes = {}) => {
    return Object.entries(attributes)
      .map(([key, value]) => `${key}: ${value}`)
      .join(", ");
  };

  const toggleCart = () => setIsOpen((prev) => !prev);

  const value = {
    cartItems,
    total,
    totalItems,
    isOpen,

    // actions
    toggleCart,
    addToCart: handleAddToCart,
    increaseQuantity: handleIncreaseQuantity,
    decreaseQuantity: handleDecreaseQuantity,
    removeFromCart: handleRemoveFromCart,

    // sync
    fetchCartFromServer,
    loadCartFromLocalStorage,

    // selection
    selectAll,
    toggleItemSelection,

    // ui helper
    displayAttributes,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

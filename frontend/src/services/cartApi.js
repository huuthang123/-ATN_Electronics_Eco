import axios from "axios";
import { apiConfig } from "../config/api";

const BASE_URL = `${apiConfig.baseURL}/api/carts`;

// Lấy giỏ hàng
export async function fetchCart(token) {
  try {
    if (!token) throw new Error("Thiếu token");

    const response = await axios.get(BASE_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Cart response:", response.data);

    return response.data.items || [];
  } catch (error) {
    console.error("Error fetching cart:", error.message);
    throw new Error(error.response?.data?.message || "Không thể tải giỏ hàng");
  }
}

// Thêm vào giỏ hàng
export async function addToCart(product, token) {
  try {
    if (!token) throw new Error("Thiếu token");

    const { productId, quantity = 1, price } = product;

    const payload = {
      productId,
      quantity,
      price
    };

    console.log("Adding to cart:", payload);

    const response = await axios.post(
      `${BASE_URL}/add`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return response.data.items || [];
  } catch (error) {
    console.error("Error adding to cart:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Lỗi khi thêm vào giỏ hàng");
  }
}

// Tăng số lượng
export async function increaseQuantity(productId, token) {
  try {
    if (!token) throw new Error("Thiếu token");

    const response = await axios.post(
      `${BASE_URL}/increase/${productId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return response.data.items || [];
  } catch (error) {
    console.error("Error increasing quantity:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Lỗi khi tăng số lượng");
  }
}

// Giảm số lượng
export async function decreaseQuantity(productId, token) {
  try {
    if (!token) throw new Error("Thiếu token");

    const response = await axios.post(
      `${BASE_URL}/decrease/${productId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return response.data.items || [];
  } catch (error) {
    console.error("Error decreasing quantity:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Lỗi khi giảm số lượng");
  }
}

// Xóa khỏi giỏ hàng
export async function removeFromCart(productId, token) {
  try {
    if (!token) throw new Error("Thiếu token");

    const response = await axios.delete(
      `${BASE_URL}/remove/${productId}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    return response.data.items || [];
  } catch (error) {
    console.error("Error removing from cart:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Lỗi khi xóa khỏi giỏ hàng");
  }
}

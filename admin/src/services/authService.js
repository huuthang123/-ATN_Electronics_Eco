// src/services/authService.js
import api from "./api";

export const login = async (email, password) => {
<<<<<<< HEAD
  try {
    const response = await api.post("/api/auth/login", { email, password });
    // Xử lý giống hệt customer - trả về trực tiếp response.data
    // Backend trả về { success: true, user, token: accessToken }
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "Đăng nhập thất bại";
    throw new Error(errorMessage);
  }
};

export const getMe = async () => {
  try {
    const response = await api.get("/api/auth/me");
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "Không thể lấy thông tin người dùng";
    throw new Error(errorMessage);
  }
=======
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

export const getMe = async () => {
  const response = await api.get("/auth/me");
  return response.data;
>>>>>>> ae0593a67756b636735aa87496db449960755e2a
};
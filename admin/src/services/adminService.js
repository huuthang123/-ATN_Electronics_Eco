// src/services/adminService.js
import api from "./api";

export const checkAdminRole = async () => {
<<<<<<< HEAD
  const response = await api.get("/api/auth/me");
=======
  const response = await api.get("/auth/me");
>>>>>>> ae0593a67756b636735aa87496db449960755e2a
  return response.data;
};

export const getAllOrders = async () => {
<<<<<<< HEAD
  const response = await api.get("/api/orders");
=======
  const response = await api.get("/orders");
>>>>>>> ae0593a67756b636735aa87496db449960755e2a
  return response.data;
};

export const updateOrderStatus = async (orderId, status) => {
<<<<<<< HEAD
  const response = await api.patch(`/api/orders/${orderId}/status`, { status });
=======
  const response = await api.put(`/orders/${orderId}/status`, { status });
>>>>>>> ae0593a67756b636735aa87496db449960755e2a
  return response.data;
};
<<<<<<< HEAD
// src/services/orderService.js
import api from './api';

export const getOrders = async () => {
  const response = await api.get('/api/orders');
=======
import api from './api';

export const getOrders = async () => {
  const response = await api.get('/orders');
>>>>>>> ae0593a67756b636735aa87496db449960755e2a
  return response.data;
};

export const updateOrderStatus = async (id, status) => {
<<<<<<< HEAD
  const response = await api.patch(`/api/orders/${id}/status`, { status });
  return response.data;
};

export const getRevenue = async (params) => {
  const response = await api.get('/api/orders/revenue', { params });
=======
  const response = await api.put(`/orders/${id}/status`, { status });
>>>>>>> ae0593a67756b636735aa87496db449960755e2a
  return response.data;
};
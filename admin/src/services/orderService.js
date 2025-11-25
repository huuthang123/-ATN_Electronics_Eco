// src/services/orderService.js
import api from './api';

export const getOrders = async () => {
  const response = await api.get('/api/orders');
  return response.data;
};

export const updateOrderStatus = async (id, status) => {
  const response = await api.patch(`/api/orders/${id}/status`, { status });
  return response.data;
};

export const getRevenue = async (params) => {
  const response = await api.get('/api/orders/revenue', { params });
  return response.data;
};
<<<<<<< HEAD
// src/services/categoryService.js
import api from "./api";

export const getCategories = async () => {
  const response = await api.get("/api/categories/list");
=======
import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/categories`;

export const getCategories = async () => {
  const response = await axios.get(`${API_URL}/list`);
>>>>>>> ae0593a67756b636735aa87496db449960755e2a
  return response.data;
};

export const addCategory = async (categoryData) => {
<<<<<<< HEAD
  const response = await api.post("/api/categories", categoryData);
  return response.data;
};

export const updateCategory = async (id, categoryData) => {
  const response = await api.put(`/api/categories/${id}`, categoryData);
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await api.delete(`/api/categories/${id}`);
=======
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Chưa đăng nhập');

  const response = await axios.post(`${API_URL}/add`, categoryData, {
    headers: { Authorization: `Bearer ${token}` }
  });
>>>>>>> ae0593a67756b636735aa87496db449960755e2a
  return response.data;
};

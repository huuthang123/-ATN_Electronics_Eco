<<<<<<< HEAD
// src/services/attributeService.js
import api from "./api";

export const getAttributes = async () => {
  const response = await api.get("/api/attributes");
  return response.data;
};

export const getAttributeById = async (id) => {
  const response = await api.get(`/api/attributes/${id}`);
=======
import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/attributes`;

export const getAttributes = async () => {
  const response = await axios.get(`${API_URL}/list`);
>>>>>>> ae0593a67756b636735aa87496db449960755e2a
  return response.data;
};

export const addAttribute = async (attributeData) => {
<<<<<<< HEAD
  const response = await api.post("/api/attributes", attributeData);
  return response.data;
};

export const updateAttribute = async (id, attributeData) => {
  const response = await api.put(`/api/attributes/${id}`, attributeData);
  return response.data;
};

export const deleteAttribute = async (id) => {
  const response = await api.delete(`/api/attributes/${id}`);
=======
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Chưa đăng nhập');

  const response = await axios.post(`${API_URL}/add`, attributeData, {
    headers: { Authorization: `Bearer ${token}` }
  });
>>>>>>> ae0593a67756b636735aa87496db449960755e2a
  return response.data;
};

// src/services/productService.js
import api from "./api";

export const getProducts = async () => {
<<<<<<< HEAD
  const response = await api.get("/api/products");
=======
  const response = await api.get("/products/list");
>>>>>>> ae0593a67756b636735aa87496db449960755e2a
  return response.data;
};

export const addProduct = async (productData) => {
<<<<<<< HEAD
  const response = await api.post("/api/products", productData);
=======
  const response = await api.post("/products/add", productData);
>>>>>>> ae0593a67756b636735aa87496db449960755e2a
  return response.data;
};

export const updateProduct = async (id, productData) => {
<<<<<<< HEAD
  const response = await api.put(`/api/products/${id}`, productData);
=======
  const response = await api.put(`/products/${id}`, productData);
>>>>>>> ae0593a67756b636735aa87496db449960755e2a
  return response.data;
};

export const deleteProduct = async (id) => {
<<<<<<< HEAD
  const response = await api.delete(`/api/products/${id}`);
=======
  const response = await api.delete(`/products/${id}`);
>>>>>>> ae0593a67756b636735aa87496db449960755e2a
  return response.data;
};
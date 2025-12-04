import axios from 'axios';

<<<<<<< HEAD
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
=======
const API_URL = process.env.REACT_APP_API_URL;
>>>>>>> ae0593a67756b636735aa87496db449960755e2a

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm interceptor để tự động gắn token vào header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

<<<<<<< HEAD
// Response interceptor để xử lý lỗi
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      localStorage.removeItem('token');
      if (window.location.pathname !== '/signin') {
        window.location.href = '/signin';
      }
    }
    return Promise.reject(error);
  }
);

=======
>>>>>>> ae0593a67756b636735aa87496db449960755e2a
export default api;
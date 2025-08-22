import axios from 'axios';
import { getToken, removeToken } from './auth';

// Create axios instance
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      removeToken();
      window.location.href = '/';
    }
    
    // Show error message
    if (error.response?.data?.message) {
      alert(error.response.data.message);
    } else {
      alert('An error occurred. Please try again.');
    }
    
    return Promise.reject(error);
  }
);

export default api;

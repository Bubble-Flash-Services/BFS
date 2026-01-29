/**
 * Capacitor-compatible API Client for BFS App
 * Supports REST API calls with JWT authentication and HTTPS
 * Works on both web and native (Android/iOS) platforms
 */
import axios from 'axios';

// API base URL - can be overridden by Capacitor server config
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://my-bfs-backend.com';

/**
 * Create axios instance with default configuration
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor to add JWT token to all requests
 */
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage (works on both web and Capacitor)
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request in development
    if (import.meta.env.DEV) {
      console.log('API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
        hasAuth: !!token,
      });
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor to handle common errors
 */
apiClient.interceptors.response.use(
  (response) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log('API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized (expired token)
    if (error.response?.status === 401) {
      console.error('Authentication failed - token expired or invalid');
      
      // Clear auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to login
      window.location.href = '/';
      
      return Promise.reject(new Error('Session expired. Please login again.'));
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }
    
    // Handle other errors
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
    console.error('API Error:', {
      status: error.response?.status,
      message: errorMessage,
      url: error.config?.url,
    });
    
    return Promise.reject(error);
  }
);

/**
 * API methods for common operations
 */
export const api = {
  // Authentication
  auth: {
    login: (credentials) => apiClient.post('/api/auth/login', credentials),
    register: (userData) => apiClient.post('/api/auth/register', userData),
    logout: () => apiClient.post('/api/auth/logout'),
    refreshToken: () => apiClient.post('/api/auth/refresh'),
  },
  
  // User operations
  user: {
    getProfile: () => apiClient.get('/api/user/profile'),
    updateProfile: (data) => apiClient.put('/api/user/profile', data),
    getOrders: () => apiClient.get('/api/user/orders'),
    getAddresses: () => apiClient.get('/api/user/addresses'),
  },
  
  // Services
  services: {
    getAll: () => apiClient.get('/api/services'),
    getById: (id) => apiClient.get(`/api/services/${id}`),
    getCategories: () => apiClient.get('/api/services/categories'),
  },
  
  // Cart
  cart: {
    get: () => apiClient.get('/api/cart'),
    add: (item) => apiClient.post('/api/cart/add', item),
    update: (itemId, quantity) => apiClient.put(`/api/cart/${itemId}`, { quantity }),
    remove: (itemId) => apiClient.delete(`/api/cart/${itemId}`),
    clear: () => apiClient.delete('/api/cart'),
  },
  
  // Orders
  orders: {
    create: (orderData) => apiClient.post('/api/orders', orderData),
    getById: (id) => apiClient.get(`/api/orders/${id}`),
    getAll: (params) => apiClient.get('/api/orders', { params }),
    cancel: (id) => apiClient.post(`/api/orders/${id}/cancel`),
  },
  
  // Payments
  payments: {
    createOrder: (amount) => apiClient.post('/api/payments/create-order', { amount }),
    verify: (paymentData) => apiClient.post('/api/payments/verify', paymentData),
  },
};

/**
 * Generic request method for custom endpoints
 */
export const request = async (method, url, data = null, config = {}) => {
  try {
    const response = await apiClient({
      method,
      url,
      data,
      ...config,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default apiClient;

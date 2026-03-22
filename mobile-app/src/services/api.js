import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '../config';

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor - attach auth token
api.interceptors.request.use(
  async config => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      // Silently fail if token retrieval fails
    }
    return config;
  },
  error => Promise.reject(error),
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
    }
    return Promise.reject(error);
  },
);

export const get = (url, params = {}) => api.get(url, {params});
export const post = (url, data = {}) => api.post(url, data);
export const put = (url, data = {}) => api.put(url, data);
export const patch = (url, data = {}) => api.patch(url, data);
export const del = (url) => api.delete(url);

export default api;

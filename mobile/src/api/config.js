import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── API Configuration ────────────────────────────────────────────────────────
const API_TIMEOUT_MS = 15000; // 15 seconds

// ─── Base URL Configuration ─────────────────────────────────────────────────
// Change this to your backend URL. For production, use your deployed URL.
// For development, use your local machine IP (not localhost) so the mobile
// device/emulator can reach your development server.
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || 'https://bfs-api.onrender.com/api';

// ─── Axios Instance ──────────────────────────────────────────────────────────
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request Interceptor: Attach token automatically ─────────────────────────
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      // Ignore storage errors
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor: Handle 401 globally ───────────────────────────────
apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired – clear storage
      await AsyncStorage.multiRemove(['token', 'user']);
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default apiClient;

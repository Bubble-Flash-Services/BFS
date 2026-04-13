import apiClient from './config';

// ─── Auth API ─────────────────────────────────────────────────────────────────

export const signup = (data) =>
  apiClient.post('/auth/signup', data);

export const login = (data) =>
  apiClient.post('/auth/login', data);

export const getProfile = (token) =>
  apiClient.get('/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateProfile = (data) =>
  apiClient.put('/auth/me', data);

export const forgotPassword = (email) =>
  apiClient.post('/auth/forgot-password', { email });

export const resetPassword = (token, password) =>
  apiClient.post('/auth/reset-password', { token, password });

export const sendOtp = (phone) =>
  apiClient.post('/auth/send-otp', { phone });

export const signinOtp = (data) =>
  apiClient.post('/auth/signin-otp', data);

/**
 * In-app Google OAuth: exchange Google accessToken for app JWT.
 * This is used by expo-auth-session flow (no browser redirect).
 */
export const googleTokenLogin = (accessToken) =>
  apiClient.post('/auth/google-token', { access_token: accessToken });

// ─── Admin Auth ───────────────────────────────────────────────────────────────

export const adminLogin = (data) =>
  apiClient.post('/admin/auth/login', data);

export const getAdminProfile = (adminToken) =>
  apiClient.get('/admin/auth/me', {
    headers: { Authorization: `Bearer ${adminToken}` },
  });

// ─── Employee Auth ────────────────────────────────────────────────────────────

export const employeeLogin = (data) =>
  apiClient.post('/employee/auth/login', data);

export const sendEmployeeOtp = (data) =>
  apiClient.post('/employee/auth/send-otp', data);

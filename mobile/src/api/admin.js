import apiClient from './config';

// ─── Admin Dashboard ──────────────────────────────────────────────────────────

export const getAdminDashboard = (adminToken) =>
  apiClient.get('/admin/dashboard', {
    headers: { Authorization: `Bearer ${adminToken}` },
  });

export const getAllUsers = (adminToken, params) =>
  apiClient.get('/admin/users', {
    params,
    headers: { Authorization: `Bearer ${adminToken}` },
  });

export const getAllAdminOrders = (adminToken, params) =>
  apiClient.get('/admin/orders', {
    params,
    headers: { Authorization: `Bearer ${adminToken}` },
  });

export const updateOrderStatus = (adminToken, orderId, status) =>
  apiClient.put(
    `/admin/orders/${orderId}/status`,
    { status },
    { headers: { Authorization: `Bearer ${adminToken}` } }
  );

// ─── Employee ─────────────────────────────────────────────────────────────────

export const getEmployeeDashboard = (employeeToken) =>
  apiClient.get('/employee/dashboard', {
    headers: { Authorization: `Bearer ${employeeToken}` },
  });

export const getEmployeeAssignments = (employeeToken) =>
  apiClient.get('/employee/assignments', {
    headers: { Authorization: `Bearer ${employeeToken}` },
  });

export const markAssignmentComplete = (employeeToken, assignmentId) =>
  apiClient.put(
    `/employee/assignments/${assignmentId}/complete`,
    {},
    { headers: { Authorization: `Bearer ${employeeToken}` } }
  );

export const getEmployeeAttendance = (employeeToken) =>
  apiClient.get('/employee/attendance', {
    headers: { Authorization: `Bearer ${employeeToken}` },
  });

export const markAttendance = (employeeToken, data) =>
  apiClient.post('/employee/attendance', data, {
    headers: { Authorization: `Bearer ${employeeToken}` },
  });

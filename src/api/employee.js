// Simple wrapper for Employee API calls using the employeeToken from localStorage

const getAuthHeaders = () => {
  const token = localStorage.getItem('employeeToken');
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : undefined,
  };
};

export const employeeLoginMobile = async (phone) => {
  const res = await fetch('/api/employee/auth/login-mobile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone }),
  });
  return res.json();
};

export const getEmployeeDashboard = async () => {
  const res = await fetch('/api/employee/dashboard', { headers: getAuthHeaders() });
  if (res.status === 401) {
    let body = {};
    try { body = await res.json(); } catch { body = { success: false, code: 'TOKEN_INVALID' }; }
    if (body?.code === 'TOKEN_EXPIRED') {
      localStorage.removeItem('employeeToken');
      localStorage.removeItem('employeeUser');
    }
    return body;
  }
  try { return await res.json(); } catch { return { success: false, message: 'Invalid response' }; }
};

export const getAssignments = async ({ page = 1, limit = 10, status = 'all', dateFilter = 'all', search = '' } = {}) => {
  const params = new URLSearchParams({ page, limit, status, dateFilter, search });
  const res = await fetch(`/api/employee/assignments?${params.toString()}`, { headers: getAuthHeaders() });
  if (res.status === 401) {
    let body = {};
    try { body = await res.json(); } catch { body = { success: false, code: 'TOKEN_INVALID' }; }
    if (body?.code === 'TOKEN_EXPIRED') {
      localStorage.removeItem('employeeToken');
      localStorage.removeItem('employeeUser');
    }
    return body;
  }
  try { return await res.json(); } catch { return { success: false, message: 'Invalid response' }; }
};

export const getCompletedTasks = async ({ page = 1, limit = 10, dateFilter = 'all', ratingFilter = 'all', search = '' } = {}) => {
  const params = new URLSearchParams({ page, limit, dateFilter, ratingFilter, search });
  const res = await fetch(`/api/employee/completed?${params.toString()}`, { headers: getAuthHeaders() });
  if (res.status === 401) {
    let body = {};
    try { body = await res.json(); } catch { body = { success: false, code: 'TOKEN_INVALID' }; }
    if (body?.code === 'TOKEN_EXPIRED') {
      localStorage.removeItem('employeeToken');
      localStorage.removeItem('employeeUser');
    }
    return body;
  }
  try { return await res.json(); } catch { return { success: false, message: 'Invalid response' }; }
};

export const getAssignmentDetails = async (assignmentId) => {
  const res = await fetch(`/api/employee/assignments/${assignmentId}/details`, { headers: getAuthHeaders() });
  if (res.status === 401) {
    let body = {};
    try { body = await res.json(); } catch { body = { success: false, code: 'TOKEN_INVALID' }; }
    if (body?.code === 'TOKEN_EXPIRED') {
      localStorage.removeItem('employeeToken');
      localStorage.removeItem('employeeUser');
    }
    return body;
  }
  try { return await res.json(); } catch { return { success: false, message: 'Invalid response' }; }
};

export const updateAssignmentStatus = async (assignmentId, status, actualDuration) => {
  const res = await fetch(`/api/employee/assignments/${assignmentId}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status, actualDuration }),
  });
  if (res.status === 401) {
    let body = {};
    try { body = await res.json(); } catch { body = { success: false, code: 'TOKEN_INVALID' }; }
    if (body?.code === 'TOKEN_EXPIRED') {
      localStorage.removeItem('employeeToken');
      localStorage.removeItem('employeeUser');
    }
    return body;
  }
  try { return await res.json(); } catch { return { success: false, message: 'Invalid response' }; }
};

export const uploadAttendanceSelfie = async (fileOrDataUri) => {
  const token = localStorage.getItem('employeeToken');
  const form = new FormData();
  if (typeof fileOrDataUri === 'string') {
    form.append('image', fileOrDataUri);
  } else {
    form.append('image', fileOrDataUri);
  }
  const res = await fetch('/api/employee/attendance/selfie', {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: form,
  });
  if (res.status === 401) {
    let body = {};
    try { body = await res.json(); } catch { body = { success: false, code: 'TOKEN_INVALID' }; }
    if (body?.code === 'TOKEN_EXPIRED') {
      localStorage.removeItem('employeeToken');
      localStorage.removeItem('employeeUser');
    }
    return body;
  }
  try { return await res.json(); } catch { return { success: false, message: 'Invalid response' }; }
};

export const getAttendanceStatus = async () => {
  const res = await fetch('/api/employee/attendance/status', { headers: getAuthHeaders() });
  if (res.status === 401) {
    let body = {};
    try { body = await res.json(); } catch { body = { success: false, code: 'TOKEN_INVALID' }; }
    if (body?.code === 'TOKEN_EXPIRED') {
      localStorage.removeItem('employeeToken');
      localStorage.removeItem('employeeUser');
    }
    return body;
  }
  try { return await res.json(); } catch { return { success: false, message: 'Invalid response' }; }
};

export const uploadTaskImages = async (orderId, filesOrData) => {
  const token = localStorage.getItem('employeeToken');
  const form = new FormData();
  if (filesOrData.before) form.append('before', filesOrData.before);
  if (filesOrData.after) form.append('after', filesOrData.after);
  const res = await fetch(`/api/employee/tasks/${orderId}/images`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: form,
  });
  if (res.status === 401) {
    let body = {};
    try { body = await res.json(); } catch { body = { success: false, code: 'TOKEN_INVALID' }; }
    if (body?.code === 'TOKEN_EXPIRED') {
      localStorage.removeItem('employeeToken');
      localStorage.removeItem('employeeUser');
    }
    return body;
  }
  try { return await res.json(); } catch { return { success: false, message: 'Invalid response' }; }
};

export const completeTask = async (orderId) => {
  const res = await fetch(`/api/employee/tasks/${orderId}/complete`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  if (res.status === 401) {
    let body = {};
    try { body = await res.json(); } catch { body = { success: false, code: 'TOKEN_INVALID' }; }
    if (body?.code === 'TOKEN_EXPIRED') {
      localStorage.removeItem('employeeToken');
      localStorage.removeItem('employeeUser');
    }
    return body;
  }
  try { return await res.json(); } catch { return { success: false, message: 'Invalid response' }; }
};

export const getEmployeeProfile = async () => {
  const res = await fetch('/api/employee/profile', { headers: getAuthHeaders() });
  if (res.status === 401) {
    let body = {};
    try { body = await res.json(); } catch { body = { success: false, code: 'TOKEN_INVALID' }; }
    if (body?.code === 'TOKEN_EXPIRED') {
      localStorage.removeItem('employeeToken');
      localStorage.removeItem('employeeUser');
    }
    return body;
  }
  try { return await res.json(); } catch { return { success: false, message: 'Invalid response' }; }
};

export const updateEmployeeProfile = async (payload) => {
  const res = await fetch('/api/employee/profile', {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (res.status === 401) {
    let body = {};
    try { body = await res.json(); } catch { body = { success: false, code: 'TOKEN_INVALID' }; }
    if (body?.code === 'TOKEN_EXPIRED') {
      localStorage.removeItem('employeeToken');
      localStorage.removeItem('employeeUser');
    }
    return body;
  }
  try { return await res.json(); } catch { return { success: false, message: 'Invalid response' }; }
};

export const getEmployeeSchedule = async ({ startDate, endDate } = {}) => {
  const params = new URLSearchParams();
  if (startDate) params.set('startDate', startDate);
  if (endDate) params.set('endDate', endDate);
  const query = params.toString();
  const res = await fetch(`/api/employee/schedule${query ? `?${query}` : ''}`, { headers: getAuthHeaders() });
  if (res.status === 401) {
    let body = {};
    try { body = await res.json(); } catch { body = { success: false, code: 'TOKEN_INVALID' }; }
    if (body?.code === 'TOKEN_EXPIRED') {
      localStorage.removeItem('employeeToken');
      localStorage.removeItem('employeeUser');
    }
    return body;
  }
  try { return await res.json(); } catch { return { success: false, message: 'Invalid response' }; }
};

export default {
  employeeLoginMobile,
  getEmployeeDashboard,
  getAssignments,
  getCompletedTasks,
  updateAssignmentStatus,
  uploadAttendanceSelfie,
  uploadTaskImages,
  completeTask,
  getEmployeeProfile,
  updateEmployeeProfile,
  getEmployeeSchedule,
  getAssignmentDetails,
};

// API helpers for admin operations
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Dashboard
export async function getDashboardStats(token) {
  const res = await fetch(`${API}/api/admin/dashboard/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

// Service Categories Management
export async function createServiceCategory(token, data) {
  const res = await fetch(`${API}/api/admin/categories`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateServiceCategory(token, categoryId, data) {
  const res = await fetch(`${API}/api/admin/categories/${categoryId}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteServiceCategory(token, categoryId) {
  const res = await fetch(`${API}/api/admin/categories/${categoryId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

// Services Management
export async function createService(token, data) {
  const res = await fetch(`${API}/api/admin/services`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateService(token, serviceId, data) {
  const res = await fetch(`${API}/api/admin/services/${serviceId}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteService(token, serviceId) {
  const res = await fetch(`${API}/api/admin/services/${serviceId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

// Packages Management
export async function createPackage(token, data) {
  const res = await fetch(`${API}/api/admin/packages`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updatePackage(token, packageId, data) {
  const res = await fetch(`${API}/api/admin/packages/${packageId}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deletePackage(token, packageId) {
  const res = await fetch(`${API}/api/admin/packages/${packageId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

// Orders Management
export async function getAllOrders(token) {
  const res = await fetch(`${API}/api/admin/orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function updateOrderStatus(token, orderId, status) {
  const res = await fetch(`${API}/api/admin/orders/${orderId}/status`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify({ status }),
  });
  return res.json();
}

// Coupons Management
export async function getAllCoupons(token) {
  const res = await fetch(`${API}/api/admin/coupons`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function createCoupon(token, data) {
  const res = await fetch(`${API}/api/admin/coupons`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateCoupon(token, couponId, data) {
  const res = await fetch(`${API}/api/admin/coupons/${couponId}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteCoupon(token, couponId) {
  const res = await fetch(`${API}/api/admin/coupons/${couponId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

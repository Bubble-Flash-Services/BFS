// API helpers for order operations
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Order operations
export async function createOrder(token, data) {
  const res = await fetch(`${API}/api/orders`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getUserOrders(token) {
  const res = await fetch(`${API}/api/orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function getOrderById(token, orderId) {
  const res = await fetch(`${API}/api/orders/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function cancelOrder(token, orderId) {
  const res = await fetch(`${API}/api/orders/${orderId}/cancel`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function submitOrderReview(token, orderId, reviewData) {
  const res = await fetch(`${API}/api/orders/${orderId}/review`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify(reviewData),
  });
  return res.json();
}

export async function updatePaymentStatus(token, orderId, paymentData) {
  const res = await fetch(`${API}/api/orders/${orderId}/payment`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify(paymentData),
  });
  return res.json();
}

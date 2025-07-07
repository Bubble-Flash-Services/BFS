// API helpers for cart operations
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Cart operations
export async function getCart(token) {
  const res = await fetch(`${API}/api/cart`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function addToCart(token, data) {
  const res = await fetch(`${API}/api/cart`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateCartItem(token, itemId, data) {
  const res = await fetch(`${API}/api/cart/${itemId}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function removeFromCart(token, itemId) {
  const res = await fetch(`${API}/api/cart/${itemId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function clearCart(token) {
  const res = await fetch(`${API}/api/cart`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

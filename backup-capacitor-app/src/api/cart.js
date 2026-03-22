// API helpers for cart operations
function resolveApiBase() {
  const cfg = import.meta.env.VITE_API_URL;
  // If explicitly provided and looks like a full URL
  if (cfg && /^https?:\/\//i.test(cfg)) return cfg.replace(/\/$/, '');
  // If provided as just a port like ":5000" or "5000", normalize it
  if (cfg && (/^:\d+$/.test(cfg) || /^\d+$/.test(cfg))) {
    const port = cfg.replace(/^:/, '');
    return `${window.location.protocol}//${window.location.hostname}:${port}`;
  }
  // If provided as a bare host (e.g., "api.myhost.com"), add protocol
  if (cfg && /^[\w.-]+(:\d+)?$/.test(cfg)) {
    return `${window.location.protocol}//${cfg}`;
  }
  // Default to current origin
  return window.location.origin.replace(/\/$/, '');
}

const API = resolveApiBase();

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

// Sync localStorage cart to database
export async function syncCartToDatabase(token, cartItems) {
  const res = await fetch(`${API}/api/cart/sync`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify({ items: cartItems }),
  });
  return res.json();
}

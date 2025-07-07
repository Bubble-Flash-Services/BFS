// API helpers for address operations
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Address operations
export async function getUserAddresses(token) {
  const res = await fetch(`${API}/api/addresses`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function getAddressById(token, addressId) {
  const res = await fetch(`${API}/api/addresses/${addressId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function addAddress(token, data) {
  const res = await fetch(`${API}/api/addresses`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateAddress(token, addressId, data) {
  const res = await fetch(`${API}/api/addresses/${addressId}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteAddress(token, addressId) {
  const res = await fetch(`${API}/api/addresses/${addressId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function setDefaultAddress(token, addressId) {
  const res = await fetch(`${API}/api/addresses/${addressId}/default`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

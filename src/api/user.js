// API helpers for user operations
const API = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? window.location.origin : '');

// User profile operations
export async function getUserProfile(token) {
  const res = await fetch(`${API}/api/user/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function updateUserProfile(token, data) {
  const res = await fetch(`${API}/api/user/me`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export default {
  getUserProfile,
  updateUserProfile,
};

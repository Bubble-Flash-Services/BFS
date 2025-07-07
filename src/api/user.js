// API helpers for user operations
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// User profile operations
export async function getUserProfile(token) {
  const res = await fetch(`${API}/api/user/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export default {
  getUserProfile,
};

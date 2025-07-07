// API helpers for coupon operations
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Coupon operations
export async function getAvailableCoupons(token) {
  const res = await fetch(`${API}/api/coupons`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function validateCoupon(token, couponCode) {
  const res = await fetch(`${API}/api/coupons/validate`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify({ code: couponCode }),
  });
  return res.json();
}

export async function applyCoupon(token, couponCode, orderTotal) {
  const res = await fetch(`${API}/api/coupons/apply`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify({ code: couponCode, orderTotal }),
  });
  return res.json();
}

export async function getCouponByCode(couponCode) {
  const res = await fetch(`${API}/api/coupons/public/${couponCode}`);
  return res.json();
}

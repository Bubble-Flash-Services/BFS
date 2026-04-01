import apiClient from './config';

export const getCart = () =>
  apiClient.get('/cart');

export const addToCart = (data) =>
  apiClient.post('/cart', data);

export const updateCartItem = (itemId, data) =>
  apiClient.put(`/cart/${itemId}`, data);

export const removeFromCart = (itemId) =>
  apiClient.delete(`/cart/${itemId}`);

export const clearCart = () =>
  apiClient.delete('/cart');

export const validateCoupon = (couponCode, orderAmount) =>
  apiClient.post('/coupons/validate', { code: couponCode, orderAmount });

import apiClient from './config';

export const createOrder = (data) =>
  apiClient.post('/orders', data);

export const getUserOrders = () =>
  apiClient.get('/orders');

export const getOrderById = (orderId) =>
  apiClient.get(`/orders/${orderId}`);

export const cancelOrder = (orderId) =>
  apiClient.put(`/orders/${orderId}/cancel`);

export const submitOrderReview = (orderId, reviewData) =>
  apiClient.post(`/orders/${orderId}/review`, reviewData);

export const updatePaymentStatus = (orderId, paymentData) =>
  apiClient.put(`/orders/${orderId}/payment`, paymentData);

import apiClient from './config';

export const getAddresses = () =>
  apiClient.get('/addresses');

export const addAddress = (data) =>
  apiClient.post('/addresses', data);

export const updateAddress = (addressId, data) =>
  apiClient.put(`/addresses/${addressId}`, data);

export const deleteAddress = (addressId) =>
  apiClient.delete(`/addresses/${addressId}`);

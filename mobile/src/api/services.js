import apiClient from './config';

export const getServiceCategories = () =>
  apiClient.get('/services/categories');

export const getAllServices = () =>
  apiClient.get('/services');

export const getServiceById = (serviceId) =>
  apiClient.get(`/services/${serviceId}`);

export const getServicesByCategory = (categoryId) =>
  apiClient.get(`/services/category/${categoryId}`);

export const searchServices = (query) =>
  apiClient.get(`/services/search?q=${encodeURIComponent(query)}`);

export const getAllPackages = () =>
  apiClient.get('/services/packages/all');

export const getPackagesByService = (serviceId) =>
  apiClient.get(`/services/${serviceId}/packages`);

export const getAddOns = () =>
  apiClient.get('/services/addons');

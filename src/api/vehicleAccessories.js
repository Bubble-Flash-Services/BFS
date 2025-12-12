import apiClient from './apiClient';

const API = import.meta.env.VITE_API_URL || window.location.origin;

// Get all accessories with filters
export const getAccessories = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });

    const response = await fetch(`${API}/api/vehicle-accessories?${queryParams}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching accessories:', error);
    return { success: false, message: error.message };
  }
};

// Get single accessory by ID
export const getAccessoryById = async (id) => {
  try {
    const response = await fetch(`${API}/api/vehicle-accessories/${id}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching accessory:', error);
    return { success: false, message: error.message };
  }
};

// Get categories with counts
export const getCategories = async () => {
  try {
    const response = await fetch(`${API}/api/vehicle-accessories/meta/categories`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return { success: false, message: error.message };
  }
};

// Get featured accessories
export const getFeaturedAccessories = async () => {
  try {
    const response = await fetch(`${API}/api/vehicle-accessories/featured/list`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching featured accessories:', error);
    return { success: false, message: error.message };
  }
};

// Get related accessories
export const getRelatedAccessories = async (id) => {
  try {
    const response = await fetch(`${API}/api/vehicle-accessories/${id}/related`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching related accessories:', error);
    return { success: false, message: error.message };
  }
};

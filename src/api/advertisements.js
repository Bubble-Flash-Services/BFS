import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Configure axios defaults
axios.defaults.withCredentials = true;

const advertisementAPI = {
  // Get all advertisements with optional filters
  getAdvertisements: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.serviceType) params.append('serviceType', filters.serviceType);
      if (filters.isActive !== undefined) params.append('isActive', filters.isActive);
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.skip) params.append('skip', filters.skip);
      
      const response = await axios.get(`${API_URL}/advertisements?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching advertisements:', error);
      throw error.response?.data || error;
    }
  },

  // Get advertisement by ID
  getAdvertisementById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/advertisements/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching advertisement:', error);
      throw error.response?.data || error;
    }
  },

  // Create new advertisement
  createAdvertisement: async (advertisementData) => {
    try {
      const formData = new FormData();
      
      // Add text fields
      Object.keys(advertisementData).forEach(key => {
        if (key !== 'image' && advertisementData[key] !== undefined) {
          if (Array.isArray(advertisementData[key])) {
            advertisementData[key].forEach(item => {
              formData.append(key, item);
            });
          } else {
            formData.append(key, advertisementData[key]);
          }
        }
      });
      
      // Add image file if present
      if (advertisementData.image) {
        formData.append('image', advertisementData.image);
      }
      
      const response = await axios.post(`${API_URL}/advertisements`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating advertisement:', error);
      throw error.response?.data || error;
    }
  },

  // Update advertisement
  updateAdvertisement: async (id, updateData) => {
    try {
      const formData = new FormData();
      
      // Add text fields
      Object.keys(updateData).forEach(key => {
        if (key !== 'image' && updateData[key] !== undefined) {
          if (Array.isArray(updateData[key])) {
            updateData[key].forEach(item => {
              formData.append(key, item);
            });
          } else {
            formData.append(key, updateData[key]);
          }
        }
      });
      
      // Add image file if present
      if (updateData.image) {
        formData.append('image', updateData.image);
      }
      
      const response = await axios.put(`${API_URL}/advertisements/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating advertisement:', error);
      throw error.response?.data || error;
    }
  },

  // Delete advertisement
  deleteAdvertisement: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/advertisements/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting advertisement:', error);
      throw error.response?.data || error;
    }
  },

  // Track advertisement view
  trackView: async (id) => {
    try {
      const response = await axios.post(`${API_URL}/advertisements/${id}/view`);
      return response.data;
    } catch (error) {
      console.error('Error tracking view:', error);
      // Don't throw error for analytics tracking
      return null;
    }
  },

  // Track advertisement click
  trackClick: async (id) => {
    try {
      const response = await axios.post(`${API_URL}/advertisements/${id}/click`);
      return response.data;
    } catch (error) {
      console.error('Error tracking click:', error);
      // Don't throw error for analytics tracking
      return null;
    }
  },

  // Get advertisement analytics
  getAnalytics: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/advertisements/${id}/analytics`);
      return response.data;
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error.response?.data || error;
    }
  },

  // Helper function to get advertisements by service type
  getAdvertisementsByService: async (serviceType, limit = 5) => {
    return advertisementAPI.getAdvertisements({
      serviceType,
      isActive: true,
      limit
    });
  },

  // Helper function to get active advertisements
  getActiveAdvertisements: async (limit = 10) => {
    return advertisementAPI.getAdvertisements({
      isActive: true,
      limit
    });
  }
};

export default advertisementAPI;

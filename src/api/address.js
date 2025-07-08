// Frontend API helper for address services
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const addressAPI = {
  // Reverse geocode coordinates to address
  reverseGeocode: async (latitude, longitude) => {
    try {
      const response = await fetch(`${API_BASE}/addresses/reverse-geocode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ latitude, longitude }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Reverse geocode error:', error);
      return {
        success: false,
        message: 'Failed to reverse geocode address',
        error: error.message
      };
    }
  },

  // Search addresses by query
  searchAddresses: async (query, limit = 5) => {
    try {
      const response = await fetch(
        `${API_BASE}/addresses/search?query=${encodeURIComponent(query)}&limit=${limit}`
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Search addresses error:', error);
      return {
        success: false,
        message: 'Failed to search addresses',
        error: error.message
      };
    }
  },

  // Get address suggestions for autocomplete
  getAddressSuggestions: async (query, limit = 5) => {
    try {
      const response = await fetch(
        `${API_BASE}/addresses/suggestions?query=${encodeURIComponent(query)}&limit=${limit}`
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Address suggestions error:', error);
      return {
        success: false,
        message: 'Failed to get address suggestions',
        error: error.message
      };
    }
  },

  // Get current location using browser geolocation
  getCurrentLocation: () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          let message = 'Unknown error occurred';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              message = 'Location access denied by user';
              break;
            case error.POSITION_UNAVAILABLE:
              message = 'Location information unavailable';
              break;
            case error.TIMEOUT:
              message = 'Location request timed out';
              break;
          }
          reject(new Error(message));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    });
  },

  // Get current address using geolocation
  getCurrentAddress: async () => {
    try {
      const location = await addressAPI.getCurrentLocation();
      const addressResult = await addressAPI.reverseGeocode(
        location.latitude,
        location.longitude
      );

      if (addressResult.success) {
        return {
          success: true,
          data: {
            ...addressResult.data,
            accuracy: location.accuracy
          }
        };
      } else {
        return addressResult;
      }
    } catch (error) {
      console.error('Get current address error:', error);
      return {
        success: false,
        message: error.message,
        error: error.message
      };
    }
  },

  // Get user's saved addresses (requires authentication)
  getUserAddresses: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/addresses`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get user addresses error:', error);
      return {
        success: false,
        message: 'Failed to fetch user addresses',
        error: error.message
      };
    }
  },

  // Add new address (requires authentication)
  addAddress: async (addressData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/addresses`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addressData),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Add address error:', error);
      return {
        success: false,
        message: 'Failed to add address',
        error: error.message
      };
    }
  },

  // Update address (requires authentication)
  updateAddress: async (addressId, addressData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/addresses/${addressId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addressData),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Update address error:', error);
      return {
        success: false,
        message: 'Failed to update address',
        error: error.message
      };
    }
  },

  // Delete address (requires authentication)
  deleteAddress: async (addressId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/addresses/${addressId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Delete address error:', error);
      return {
        success: false,
        message: 'Failed to delete address',
        error: error.message
      };
    }
  },

  // Set default address (requires authentication)
  setDefaultAddress: async (addressId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/addresses/${addressId}/default`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Set default address error:', error);
      return {
        success: false,
        message: 'Failed to set default address',
        error: error.message
      };
    }
  }
};

export default addressAPI;

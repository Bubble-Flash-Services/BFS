// Frontend API helper for address services
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const addressAPI = {
  // Reverse geocode coordinates to address
  reverseGeocode: async (latitude, longitude) => {
    try {
      // First try the backend API
      const response = await fetch(`${API_BASE}/addresses/reverse-geocode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ latitude, longitude }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          return data;
        }
      }
      
      // Fallback to direct geocoding service
      console.log('Backend reverse geocoding failed, trying fallback service...');
      return await addressAPI.reverseGeocodeWithFallback(latitude, longitude);
      
    } catch (error) {
      console.error('Reverse geocode error:', error);
      // Try fallback service
      try {
        return await addressAPI.reverseGeocodeWithFallback(latitude, longitude);
      } catch (fallbackError) {
        return {
          success: false,
          message: 'Failed to reverse geocode address',
          error: fallbackError.message
        };
      }
    }
  },

  // Fallback reverse geocoding using OpenStreetMap Nominatim (free service)
  reverseGeocodeWithFallback: async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'BubbleFlash-App/1.0'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Nominatim API request failed');
      }

      const data = await response.json();
      
      if (data && data.display_name) {
        // Parse the address components
        const address = data.address || {};
        
        return {
          success: true,
          data: {
            fullAddress: data.display_name,
            formattedAddress: data.display_name,
            coordinates: {
              latitude: parseFloat(data.lat),
              longitude: parseFloat(data.lon)
            },
            components: {
              street: address.road || address.street || '',
              city: address.city || address.town || address.village || '',
              state: address.state || '',
              country: address.country || '',
              postalCode: address.postcode || '',
              area: address.suburb || address.neighbourhood || ''
            },
            placeId: data.place_id?.toString() || '',
            source: 'nominatim'
          }
        };
      } else {
        throw new Error('No address found for these coordinates');
      }
    } catch (error) {
      console.error('Fallback reverse geocoding error:', error);
      throw new Error(`Fallback reverse geocoding failed: ${error.message}`);
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

      // Check if we're on HTTP (not HTTPS) and not localhost
      if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
        reject(new Error('Geolocation requires HTTPS for security reasons'));
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
              message = 'Location access denied by user. Please enable location permissions in your browser settings.';
              break;
            case error.POSITION_UNAVAILABLE:
              message = 'Location information unavailable. Please check your GPS/internet connection.';
              break;
            case error.TIMEOUT:
              message = 'Location request timed out. Please try again.';
              break;
          }
          reject(new Error(message));
        },
        {
          enableHighAccuracy: false, // Changed to false for faster response
          timeout: 15000, // Increased timeout to 15 seconds
          maximumAge: 300000 // Increased cache time to 5 minutes
        }
      );
    });
  },

  // Get current address using geolocation
  getCurrentAddress: async () => {
    try {
      const location = await addressAPI.getCurrentLocation();
      const addressResult = await addressAPI.reverseGeocodeWithFallback(
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

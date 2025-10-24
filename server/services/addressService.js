// Using built-in fetch API (Node.js 18+)
// If running on older Node.js versions, install node-fetch: npm install node-fetch
import fetch from 'node-fetch';

class AddressService {
  constructor() {
    this.nominatimBaseUrl = 'https://nominatim.openstreetmap.org';
    this.geocodingBaseUrl = 'https://api.opencagedata.com/geocode/v1';
    this.openCageApiKey = process.env.OPENCAGE_API_KEY; // Add this to your .env file
  }

  // Get current location by coordinates
  async reverseGeocode(latitude, longitude) {
    try {
      // Try OpenCage first if API key is available
      if (this.openCageApiKey) {
        const response = await fetch(
          `${this.geocodingBaseUrl}/json?q=${latitude}+${longitude}&key=${this.openCageApiKey}&language=en&pretty=1`
        );
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
          const result = data.results[0];
          return {
            success: true,
            data: {
              fullAddress: result.formatted,
              latitude: result.geometry.lat,
              longitude: result.geometry.lng,
              city: result.components.city || result.components.town || result.components.village,
              state: result.components.state,
              pincode: result.components.postcode,
              country: result.components.country,
              confidence: result.confidence
            }
          };
        }
      }

      // Fallback to Nominatim (free but rate limited)
      const response = await fetch(
        `${this.nominatimBaseUrl}/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'BubbleFlash-App/1.0',
            'Accept': 'application/json'
          }
        }
      );
      const data = await response.json();

      if (data.display_name) {
        return {
          success: true,
          data: {
            fullAddress: data.display_name,
            latitude: parseFloat(data.lat),
            longitude: parseFloat(data.lon),
            city: data.address?.city || data.address?.town || data.address?.village,
            state: data.address?.state,
            pincode: data.address?.postcode,
            country: data.address?.country,
            confidence: 0.8 // Nominatim doesn't provide confidence score
          }
        };
      }

      return {
        success: false,
        message: 'Unable to find address for the given coordinates'
      };
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return {
        success: false,
        message: 'Failed to reverse geocode address',
        error: error.message
      };
    }
  }

  // Search addresses by query
  async searchAddresses(query, limit = 5) {
    try {
      // Try OpenCage first if API key is available
      if (this.openCageApiKey) {
        const response = await fetch(
          `${this.geocodingBaseUrl}/json?q=${encodeURIComponent(query)}&key=${this.openCageApiKey}&language=en&limit=${limit}&countrycode=in&pretty=1`
        );
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
          return {
            success: true,
            data: data.results.map(result => ({
              fullAddress: result.formatted,
              latitude: result.geometry.lat,
              longitude: result.geometry.lng,
              city: result.components.city || result.components.town || result.components.village,
              state: result.components.state,
              pincode: result.components.postcode,
              country: result.components.country,
              confidence: result.confidence
            }))
          };
        }
      }

      // Fallback to Nominatim
      const response = await fetch(
        `${this.nominatimBaseUrl}/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=${limit}&countrycode=in`,
        {
          headers: {
            'User-Agent': 'BubbleFlash-App/1.0',
            'Accept': 'application/json'
          }
        }
      );
      const data = await response.json();

      if (data && data.length > 0) {
        return {
          success: true,
          data: data.map(item => ({
            fullAddress: item.display_name,
            latitude: parseFloat(item.lat),
            longitude: parseFloat(item.lon),
            city: item.address?.city || item.address?.town || item.address?.village,
            state: item.address?.state,
            pincode: item.address?.postcode,
            country: item.address?.country,
            confidence: 0.8
          }))
        };
      }

      return {
        success: false,
        message: 'No addresses found for the query'
      };
    } catch (error) {
      console.error('Address search error:', error);
      return {
        success: false,
        message: 'Failed to search addresses',
        error: error.message
      };
    }
  }

  // Get address suggestions for autocomplete
  async getAddressSuggestions(query, limit = 5) {
    try {
      const url = `${this.nominatimBaseUrl}/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=${limit}&countrycode=in`;
      console.log('Fetching address suggestions from:', url);
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'BubbleFlash-App/1.0',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        console.error('Nominatim API error:', response.status, response.statusText);
        return {
          success: false,
          message: `API request failed with status ${response.status}`
        };
      }

      const data = await response.json();
      console.log('Nominatim API response:', data.length, 'results');

      if (data && data.length > 0) {
        return {
          success: true,
          data: data.map(item => ({
            display_name: item.display_name,
            place_id: item.place_id,
            latitude: parseFloat(item.lat),
            longitude: parseFloat(item.lon),
            city: item.address?.city || item.address?.town || item.address?.village,
            state: item.address?.state,
            pincode: item.address?.postcode
          }))
        };
      }

      return {
        success: false,
        message: 'No suggestions found'
      };
    } catch (error) {
      console.error('Address suggestions error:', error);
      return {
        success: false,
        message: 'Failed to get address suggestions',
        error: error.message
      };
    }
  }

  // Validate address format
  validateAddress(address) {
    const errors = [];

    if (!address.fullAddress || address.fullAddress.trim().length < 10) {
      errors.push('Full address must be at least 10 characters long');
    }

    if (address.latitude && (address.latitude < -90 || address.latitude > 90)) {
      errors.push('Invalid latitude value');
    }

    if (address.longitude && (address.longitude < -180 || address.longitude > 180)) {
      errors.push('Invalid longitude value');
    }

    if (address.pincode && !/^\d{6}$/.test(address.pincode)) {
      errors.push('Pincode must be a 6-digit number');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Calculate distance between two coordinates (in kilometers)
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return Math.round(distance * 100) / 100; // Round to 2 decimal places
  }
}

export default new AddressService();

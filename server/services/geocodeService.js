import fetch from 'node-fetch';

/**
 * Geocode an address to coordinates using Nominatim (OpenStreetMap)
 * Free and no API key required
 */
export async function geocodeAddress(address) {
  try {
    const query = encodeURIComponent(address);
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'BubbleFlashServices/1.0'
      }
    });

    const data = await response.json();

    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        displayName: data[0].display_name
      };
    }

    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

/**
 * Reverse geocode coordinates to address
 */
export async function reverseGeocode(lat, lng) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'BubbleFlashServices/1.0'
      }
    });

    const data = await response.json();

    if (data) {
      return {
        displayName: data.display_name,
        address: data.address,
        city: data.address?.city || data.address?.town || data.address?.village,
        pincode: data.address?.postcode
      };
    }

    return null;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return null;
  }
}

/**
 * Get coordinates from pincode (Bangalore specific)
 * This is a simplified version - in production, use a proper geocoding service
 */
export async function getPincodeCoordinates(pincode) {
  return geocodeAddress(`${pincode}, Bengaluru, Karnataka, India`);
}

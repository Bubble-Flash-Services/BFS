/**
 * Haversine formula to calculate distance between two coordinates
 * Returns distance in kilometers
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 100) / 100; // Round to 2 decimal places
}

function toRad(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Calculate distance charge based on distance from branch
 * Rules:
 * <= 5 km → ₹0
 * > 5 && <= 10 km → ₹50
 * > 10 && <= 15 km → ₹100
 * > 15 km → ₹100 (if inside Bangalore), otherwise not available
 */
export function calculateDistanceCharge(distanceKm, isInsideBangalore = true) {
  if (distanceKm <= 5) {
    return 0;
  } else if (distanceKm <= 10) {
    return 50;
  } else if (distanceKm <= 15) {
    return 100;
  } else if (isInsideBangalore) {
    return 100;
  } else {
    return null; // Service not available
  }
}

/**
 * Find nearest branch from given coordinates
 * Returns { branch, distance }
 */
export function findNearestBranch(branches, latitude, longitude) {
  if (!branches || branches.length === 0) {
    return null;
  }

  let nearest = null;
  let minDistance = Infinity;

  branches.forEach(branch => {
    const distance = calculateDistance(latitude, longitude, branch.lat, branch.lng);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = branch;
    }
  });

  return {
    branch: nearest,
    distance: minDistance
  };
}

/**
 * Bangalore pincode ranges (simplified - can be extended)
 * Bangalore pincodes typically range from 560001 to 560107
 */
const BANGALORE_PINCODE_RANGES = [
  { start: 560001, end: 560107 }
];

/**
 * Check if pincode is within Bangalore
 */
export function isInsideBangalore(pincode) {
  if (!pincode) return false;
  
  const code = parseInt(pincode);
  if (isNaN(code)) return false;

  return BANGALORE_PINCODE_RANGES.some(
    range => code >= range.start && code <= range.end
  );
}

/**
 * Validate service availability based on distance and location
 * Returns { available: boolean, reason: string }
 */
export function validateServiceAvailability(distanceKm, pincode) {
  const insideBangalore = isInsideBangalore(pincode);

  if (distanceKm <= 15) {
    return { available: true, reason: null };
  }

  if (distanceKm > 15 && insideBangalore) {
    return { 
      available: true, 
      reason: 'Long distance charge applicable'
    };
  }

  return {
    available: false,
    reason: 'Service not available in this area. Currently serving only within Bangalore.'
  };
}

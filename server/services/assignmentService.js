import Provider from '../models/Provider.js';
import Branch from '../models/Branch.js';
import { calculateDistance } from './distanceService.js';

/**
 * Find nearest available provider for a service
 * Filters by: service offered, availability, and proximity to customer
 */
export async function findNearestProvider(serviceId, customerLat, customerLng, branchId = null) {
  try {
    const query = {
      servicesOffered: serviceId,
      available: true,
      isActive: true,
      verified: true
    };

    // If branch is specified, prioritize providers from that branch
    if (branchId) {
      query.branchId = branchId;
    }

    const providers = await Provider.find(query);

    if (providers.length === 0) {
      return null;
    }

    // Calculate distance for each provider and find nearest
    let nearest = null;
    let minDistance = Infinity;

    for (const provider of providers) {
      if (provider.lat && provider.lng) {
        const distance = calculateDistance(
          customerLat,
          customerLng,
          provider.lat,
          provider.lng
        );

        if (distance < minDistance) {
          minDistance = distance;
          nearest = provider;
        }
      }
    }

    // If no provider with location found, return first available
    return nearest || providers[0];
  } catch (error) {
    console.error('Error finding nearest provider:', error);
    return null;
  }
}

/**
 * Auto-assign booking to nearest available provider
 * Returns { success: boolean, provider: Provider, error: string }
 */
export async function autoAssignProvider(booking) {
  try {
    const provider = await findNearestProvider(
      booking.serviceId,
      booking.address.lat,
      booking.address.lng,
      booking.branchId
    );

    if (!provider) {
      return {
        success: false,
        provider: null,
        error: 'No available providers found'
      };
    }

    // Update booking with provider
    booking.providerId = provider._id;
    booking.status = 'assigned';
    await booking.save();

    // Update provider stats
    provider.totalBookings += 1;
    await provider.save();

    return {
      success: true,
      provider,
      error: null
    };
  } catch (error) {
    console.error('Error auto-assigning provider:', error);
    return {
      success: false,
      provider: null,
      error: error.message
    };
  }
}

/**
 * Manually assign provider to booking (admin action)
 */
export async function manualAssignProvider(bookingId, providerId) {
  try {
    const provider = await Provider.findById(providerId);
    
    if (!provider) {
      return {
        success: false,
        error: 'Provider not found'
      };
    }

    if (!provider.available || !provider.isActive) {
      return {
        success: false,
        error: 'Provider is not available'
      };
    }

    return {
      success: true,
      provider
    };
  } catch (error) {
    console.error('Error manual assignment:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

import Provider from '../models/Provider.js';

/**
 * Get nearby providers
 * GET /api/green/providers/nearby?lat=&lng=&serviceId=
 */
export const getNearbyProviders = async (req, res) => {
  try {
    const { lat, lng, serviceId } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    const query = {
      available: true,
      isActive: true,
      verified: true
    };

    if (serviceId) {
      query.servicesOffered = serviceId;
    }

    const providers = await Provider.find(query)
      .populate('servicesOffered')
      .populate('branchId');

    res.json({
      success: true,
      data: providers
    });
  } catch (error) {
    console.error('Error fetching nearby providers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch providers',
      error: error.message
    });
  }
};

/**
 * Provider accepts assignment
 * POST /api/green/providers/:id/accept
 */
export const acceptAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const { bookingId } = req.body;

    const provider = await Provider.findById(id);
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider not found'
      });
    }

    // Update provider availability
    provider.available = false;
    await provider.save();

    res.json({
      success: true,
      message: 'Assignment accepted',
      data: provider
    });
  } catch (error) {
    console.error('Error accepting assignment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to accept assignment',
      error: error.message
    });
  }
};

/**
 * Update provider status
 * PUT /api/green/providers/:id/status
 */
export const updateProviderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { available, lat, lng } = req.body;

    const updates = {};
    if (typeof available !== 'undefined') {
      updates.available = available;
    }
    if (lat && lng) {
      updates.lat = lat;
      updates.lng = lng;
    }

    const provider = await Provider.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    );

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider not found'
      });
    }

    res.json({
      success: true,
      message: 'Provider status updated',
      data: provider
    });
  } catch (error) {
    console.error('Error updating provider status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update provider status',
      error: error.message
    });
  }
};

/**
 * Get all providers (Admin)
 * GET /api/green/providers
 */
export const getAllProviders = async (req, res) => {
  try {
    const providers = await Provider.find()
      .populate('servicesOffered')
      .populate('branchId')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: providers
    });
  } catch (error) {
    console.error('Error fetching providers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch providers',
      error: error.message
    });
  }
};

/**
 * Create new provider (Admin)
 * POST /api/green/providers
 */
export const createProvider = async (req, res) => {
  try {
    const providerData = req.body;

    const provider = new Provider(providerData);
    await provider.save();

    res.status(201).json({
      success: true,
      message: 'Provider created successfully',
      data: provider
    });
  } catch (error) {
    console.error('Error creating provider:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create provider',
      error: error.message
    });
  }
};

import GreenService from '../models/GreenService.js';

/**
 * Get all green services (optionally filter by category)
 * GET /api/green/services?category=home-cleaning
 */
export const getGreenServices = async (req, res) => {
  try {
    const { category } = req.query;
    
    const query = { active: true };
    if (category) {
      query.category = category;
    }

    const services = await GreenService.find(query)
      .sort({ sortOrder: 1, createdAt: -1 });

    res.json({
      success: true,
      data: services
    });
  } catch (error) {
    console.error('Error fetching green services:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch services',
      error: error.message
    });
  }
};

/**
 * Get single green service by ID
 * GET /api/green/services/:id
 */
export const getGreenServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await GreenService.findById(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Error fetching green service:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch service',
      error: error.message
    });
  }
};

/**
 * Create new green service (Admin only)
 * POST /api/green/services
 */
export const createGreenService = async (req, res) => {
  try {
    const serviceData = req.body;

    const service = new GreenService(serviceData);
    await service.save();

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: service
    });
  } catch (error) {
    console.error('Error creating green service:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create service',
      error: error.message
    });
  }
};

/**
 * Update green service (Admin only)
 * PUT /api/green/services/:id
 */
export const updateGreenService = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const service = await GreenService.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      message: 'Service updated successfully',
      data: service
    });
  } catch (error) {
    console.error('Error updating green service:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update service',
      error: error.message
    });
  }
};

/**
 * Delete green service (Admin only)
 * DELETE /api/green/services/:id
 */
export const deleteGreenService = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await GreenService.findByIdAndDelete(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting green service:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete service',
      error: error.message
    });
  }
};

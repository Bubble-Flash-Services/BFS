import ServiceCategory from '../models/ServiceCategory.js';
import Service from '../models/Service.js';
import Package from '../models/Package.js';
import AddOn from '../models/AddOn.js';

// Get all service categories
export const getServiceCategories = async (req, res) => {
  try {
    const { isActive = true } = req.query;
    
    const filter = {};
    if (isActive !== 'all') {
      filter.isActive = isActive === 'true';
    }

    const categories = await ServiceCategory.find(filter)
      .sort({ sortOrder: 1, name: 1 });

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get service categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch service categories',
      error: error.message
    });
  }
};

// Get services by category
export const getServicesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { isActive = true } = req.query;

    const filter = { categoryId };
    if (isActive !== 'all') {
      filter.isActive = isActive === 'true';
    }

    const services = await Service.find(filter)
      .populate('categoryId', 'name')
      .sort({ sortOrder: 1, name: 1 });

    res.json({
      success: true,
      data: services
    });
  } catch (error) {
    console.error('Get services by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch services',
      error: error.message
    });
  }
};

// Get all services
export const getAllServices = async (req, res) => {
  try {
    const { isActive = true, categoryId } = req.query;

    const filter = {};
    if (isActive !== 'all') {
      filter.isActive = isActive === 'true';
    }
    if (categoryId) {
      filter.categoryId = categoryId;
    }

    const services = await Service.find(filter)
      .populate('categoryId', 'name')
      .sort({ sortOrder: 1, name: 1 });

    res.json({
      success: true,
      data: services
    });
  } catch (error) {
    console.error('Get all services error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch services',
      error: error.message
    });
  }
};

// Get service by ID
export const getServiceById = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const service = await Service.findById(serviceId)
      .populate('categoryId', 'name');

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
    console.error('Get service by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch service',
      error: error.message
    });
  }
};

// Get packages by service
export const getPackagesByService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { isActive = true, vehicleType } = req.query;

    const filter = { serviceId };
    if (isActive !== 'all') {
      filter.isActive = isActive === 'true';
    }
    if (vehicleType) {
      filter.vehicleTypes = vehicleType;
    }

    const packages = await Package.find(filter)
      .populate('serviceId', 'name')
      .sort({ sortOrder: 1, price: 1 });

    res.json({
      success: true,
      data: packages
    });
  } catch (error) {
    console.error('Get packages by service error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch packages',
      error: error.message
    });
  }
};

// Get all packages
export const getAllPackages = async (req, res) => {
  try {
    const { isActive = true, serviceId, vehicleType, packageType } = req.query;

    const filter = {};
    if (isActive !== 'all') {
      filter.isActive = isActive === 'true';
    }
    if (serviceId) {
      filter.serviceId = serviceId;
    }
    if (vehicleType) {
      filter.vehicleTypes = vehicleType;
    }
    if (packageType) {
      filter.packageType = packageType;
    }

    const packages = await Package.find(filter)
      .populate('serviceId', 'name categoryId')
      .populate({
        path: 'serviceId',
        populate: {
          path: 'categoryId',
          select: 'name'
        }
      })
      .sort({ sortOrder: 1, price: 1 });

    res.json({
      success: true,
      data: packages
    });
  } catch (error) {
    console.error('Get all packages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch packages',
      error: error.message
    });
  }
};

// Get package by ID
export const getPackageById = async (req, res) => {
  try {
    const { packageId } = req.params;

    const packageData = await Package.findById(packageId)
      .populate('serviceId', 'name categoryId')
      .populate({
        path: 'serviceId',
        populate: {
          path: 'categoryId',
          select: 'name'
        }
      });

    if (!packageData) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    res.json({
      success: true,
      data: packageData
    });
  } catch (error) {
    console.error('Get package by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch package',
      error: error.message
    });
  }
};

// Get add-ons
export const getAddOns = async (req, res) => {
  try {
    const { isActive = true, categoryId, serviceId } = req.query;

    const filter = {};
    if (isActive !== 'all') {
      filter.isActive = isActive === 'true';
    }
    if (categoryId) {
      filter.categoryId = categoryId;
    }
    if (serviceId) {
      filter.applicableServices = serviceId;
    }

    const addOns = await AddOn.find(filter)
      .populate('categoryId', 'name')
      .populate('applicableServices', 'name')
      .sort({ sortOrder: 1, name: 1 });

    res.json({
      success: true,
      data: addOns
    });
  } catch (error) {
    console.error('Get add-ons error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch add-ons',
      error: error.message
    });
  }
};

// Get add-on by ID
export const getAddOnById = async (req, res) => {
  try {
    const { addOnId } = req.params;

    const addOn = await AddOn.findById(addOnId)
      .populate('categoryId', 'name')
      .populate('applicableServices', 'name');

    if (!addOn) {
      return res.status(404).json({
        success: false,
        message: 'Add-on not found'
      });
    }

    res.json({
      success: true,
      data: addOn
    });
  } catch (error) {
    console.error('Get add-on by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch add-on',
      error: error.message
    });
  }
};

// Search services and packages
export const searchServices = async (req, res) => {
  try {
    const { q, categoryId, vehicleType, minPrice, maxPrice } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters long'
      });
    }

    const searchRegex = new RegExp(q.trim(), 'i');

    // Search services
    const serviceFilter = {
      isActive: true,
      $or: [
        { name: searchRegex },
        { description: searchRegex },
        { features: { $in: [searchRegex] } }
      ]
    };
    if (categoryId) {
      serviceFilter.categoryId = categoryId;
    }

    const services = await Service.find(serviceFilter)
      .populate('categoryId', 'name')
      .limit(10);

    // Search packages
    const packageFilter = {
      isActive: true,
      $or: [
        { name: searchRegex },
        { description: searchRegex },
        { features: { $in: [searchRegex] } }
      ]
    };
    if (vehicleType) {
      packageFilter.vehicleTypes = vehicleType;
    }
    if (minPrice || maxPrice) {
      packageFilter.price = {};
      if (minPrice) packageFilter.price.$gte = parseFloat(minPrice);
      if (maxPrice) packageFilter.price.$lte = parseFloat(maxPrice);
    }

    const packages = await Package.find(packageFilter)
      .populate('serviceId', 'name categoryId')
      .populate({
        path: 'serviceId',
        populate: {
          path: 'categoryId',
          select: 'name'
        }
      })
      .limit(10);

    res.json({
      success: true,
      data: {
        services,
        packages,
        totalResults: services.length + packages.length
      }
    });
  } catch (error) {
    console.error('Search services error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search services',
      error: error.message
    });
  }
};

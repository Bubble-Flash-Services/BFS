import User from '../models/User.js';
import Order from '../models/Order.js';
import Service from '../models/Service.js';
import ServiceCategory from '../models/ServiceCategory.js';
import Package from '../models/Package.js';
import AddOn from '../models/AddOn.js';
import Coupon from '../models/Coupon.js';

// Dashboard Statistics
export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalOrders,
      totalRevenue,
      pendingOrders,
      completedOrders,
      activeServices,
      activeCoupons
    ] = await Promise.all([
      User.countDocuments({ status: 'active' }),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      Order.countDocuments({ status: 'pending' }),
      Order.countDocuments({ status: 'completed' }),
      Service.countDocuments({ isActive: true }),
      Coupon.countDocuments({ isActive: true })
    ]);

    const revenueData = totalRevenue[0]?.total || 0;

    // Recent orders
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .populate('items.service', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    // Monthly revenue data for chart
    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalOrders,
          totalRevenue: revenueData,
          pendingOrders,
          completedOrders,
          activeServices,
          activeCoupons
        },
        recentOrders,
        monthlyRevenue
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics'
    });
  }
};

// User Management
export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const status = req.query.status || '';

    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    if (status) {
      query.status = status;
    }

    const users = await User.find(query)
      .select('-password -resetToken -emailOTP -phoneOTP')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        users,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    if (!['active', 'inactive', 'suspended'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { status },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user status'
    });
  }
};

// Order Management
export const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status || '';
    const search = req.query.search || '';

    const query = {};
    if (status) {
      query.status = status;
    }
    if (search) {
      // Search by order ID or user details
      const users = await User.find({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } }
        ]
      }).select('_id');
      
      query.$or = [
        { _id: { $regex: search, $options: 'i' } },
        { user: { $in: users.map(u => u._id) } }
      ];
    }

    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .populate('items.service', 'name')
      .populate('items.packageData', 'name')
      .populate('address')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: {
        orders,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, notes } = req.body;

    const validStatuses = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const updateData = { status };
    if (notes) {
      updateData.$push = { statusHistory: { status, notes, updatedAt: new Date() } };
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      updateData,
      { new: true }
    ).populate('user', 'name email phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status'
    });
  }
};

// Service Management
export const createService = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      basePrice,
      duration,
      images,
      isActive = true
    } = req.body;

    // Validate category exists
    const categoryExists = await ServiceCategory.findById(category);
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category'
      });
    }

    const service = new Service({
      name,
      description,
      category,
      basePrice,
      duration,
      images: images || [],
      isActive
    });

    await service.save();
    await service.populate('category', 'name');

    res.status(201).json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create service'
    });
  }
};

export const updateService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const updateData = req.body;

    // If category is being updated, validate it exists
    if (updateData.category) {
      const categoryExists = await ServiceCategory.findById(updateData.category);
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: 'Invalid category'
        });
      }
    }

    const service = await Service.findByIdAndUpdate(
      serviceId,
      updateData,
      { new: true, runValidators: true }
    ).populate('category', 'name');

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
    console.error('Update service error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update service'
    });
  }
};

export const deleteService = async (req, res) => {
  try {
    const { serviceId } = req.params;

    // Check if service has active orders
    const activeOrders = await Order.countDocuments({
      'items.service': serviceId,
      status: { $in: ['pending', 'confirmed', 'in_progress'] }
    });

    if (activeOrders > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete service with active orders'
      });
    }

    const service = await Service.findByIdAndDelete(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Also delete related packages and add-ons
    await Package.deleteMany({ service: serviceId });
    await AddOn.deleteMany({ applicableServices: serviceId });

    res.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete service'
    });
  }
};

// Package Management
export const createPackage = async (req, res) => {
  try {
    const {
      name,
      description,
      service,
      price,
      duration,
      features,
      isActive = true
    } = req.body;

    // Validate service exists
    const serviceExists = await Service.findById(service);
    if (!serviceExists) {
      return res.status(400).json({
        success: false,
        message: 'Invalid service'
      });
    }

    const packageData = new Package({
      name,
      description,
      service,
      price,
      duration,
      features: features || [],
      isActive
    });

    await packageData.save();
    await packageData.populate('service', 'name');

    res.status(201).json({
      success: true,
      data: packageData
    });
  } catch (error) {
    console.error('Create package error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create package'
    });
  }
};

export const updatePackage = async (req, res) => {
  try {
    const { packageId } = req.params;
    const updateData = req.body;

    const packageData = await Package.findByIdAndUpdate(
      packageId,
      updateData,
      { new: true, runValidators: true }
    ).populate('service', 'name');

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
    console.error('Update package error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update package'
    });
  }
};

export const deletePackage = async (req, res) => {
  try {
    const { packageId } = req.params;

    const packageData = await Package.findByIdAndDelete(packageId);
    if (!packageData) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    res.json({
      success: true,
      message: 'Package deleted successfully'
    });
  } catch (error) {
    console.error('Delete package error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete package'
    });
  }
};

// ========== COUPON MANAGEMENT ==========

// Get all coupons
export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find()
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: coupons
    });
  } catch (error) {
    console.error('Get coupons error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch coupons'
    });
  }
};

// Create new coupon
export const createCoupon = async (req, res) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      minimumOrderAmount,
      maximumDiscountAmount,
      validFrom,
      validUntil,
      usageLimit,
      isActive
    } = req.body;

    // Check if coupon code already exists
    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      return res.status(400).json({
        success: false,
        message: 'Coupon code already exists'
      });
    }

    const coupon = new Coupon({
      code: code.toUpperCase(),
      description,
      discountType,
      discountValue,
      minimumOrderAmount,
      maximumDiscountAmount,
      validFrom,
      validUntil,
      usageLimit,
      isActive
    });

    await coupon.save();

    res.status(201).json({
      success: true,
      data: coupon,
      message: 'Coupon created successfully'
    });
  } catch (error) {
    console.error('Create coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create coupon'
    });
  }
};

// Update coupon
export const updateCoupon = async (req, res) => {
  try {
    const { couponId } = req.params;
    const {
      code,
      description,
      discountType,
      discountValue,
      minimumOrderAmount,
      maximumDiscountAmount,
      validFrom,
      validUntil,
      usageLimit,
      isActive
    } = req.body;

    const coupon = await Coupon.findById(couponId);
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    // Check if code is being changed and if new code already exists
    if (code && code.toUpperCase() !== coupon.code) {
      const existingCoupon = await Coupon.findOne({ 
        code: code.toUpperCase(),
        _id: { $ne: couponId }
      });
      if (existingCoupon) {
        return res.status(400).json({
          success: false,
          message: 'Coupon code already exists'
        });
      }
    }

    coupon.code = code ? code.toUpperCase() : coupon.code;
    coupon.description = description || coupon.description;
    coupon.discountType = discountType || coupon.discountType;
    coupon.discountValue = discountValue !== undefined ? discountValue : coupon.discountValue;
    coupon.minimumOrderAmount = minimumOrderAmount !== undefined ? minimumOrderAmount : coupon.minimumOrderAmount;
    coupon.maximumDiscountAmount = maximumDiscountAmount !== undefined ? maximumDiscountAmount : coupon.maximumDiscountAmount;
    coupon.validFrom = validFrom || coupon.validFrom;
    coupon.validUntil = validUntil || coupon.validUntil;
    coupon.usageLimit = usageLimit !== undefined ? usageLimit : coupon.usageLimit;
    coupon.isActive = isActive !== undefined ? isActive : coupon.isActive;

    await coupon.save();

    res.json({
      success: true,
      data: coupon,
      message: 'Coupon updated successfully'
    });
  } catch (error) {
    console.error('Update coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update coupon'
    });
  }
};

// Delete coupon
export const deleteCoupon = async (req, res) => {
  try {
    const { couponId } = req.params;

    const coupon = await Coupon.findById(couponId);
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    await Coupon.findByIdAndDelete(couponId);

    res.json({
      success: true,
      message: 'Coupon deleted successfully'
    });
  } catch (error) {
    console.error('Delete coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete coupon'
    });
  }
};

// Service Category Management
export const createServiceCategory = async (req, res) => {
  try {
    const { name, description, icon, isActive = true } = req.body;

    const category = new ServiceCategory({
      name,
      description,
      icon,
      isActive
    });

    await category.save();

    res.status(201).json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Create service category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create service category'
    });
  }
};

export const updateServiceCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const updateData = req.body;

    const category = await ServiceCategory.findByIdAndUpdate(
      categoryId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Service category not found'
      });
    }

    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Update service category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update service category'
    });
  }
};

export const deleteServiceCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Check if category has services
    const servicesCount = await Service.countDocuments({ category: categoryId });
    if (servicesCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with existing services'
      });
    }

    const category = await ServiceCategory.findByIdAndDelete(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Service category not found'
      });
    }

    res.json({
      success: true,
      message: 'Service category deleted successfully'
    });
  } catch (error) {
    console.error('Delete service category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete service category'
    });
  }
};

export const getAllServiceCategories = async (req, res) => {
  try {
    const categories = await ServiceCategory.find()
      .populate('services')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get service categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch service categories'
    });
  }
};

// Add-On Management
export const createAddOn = async (req, res) => {
  try {
    const addOn = new AddOn(req.body);
    await addOn.save();

    res.status(201).json({
      success: true,
      data: addOn
    });
  } catch (error) {
    console.error('Create add-on error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create add-on'
    });
  }
};

export const updateAddOn = async (req, res) => {
  try {
    const { addOnId } = req.params;
    const updateData = req.body;

    const addOn = await AddOn.findByIdAndUpdate(
      addOnId,
      updateData,
      { new: true, runValidators: true }
    );

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
    console.error('Update add-on error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update add-on'
    });
  }
};

export const deleteAddOn = async (req, res) => {
  try {
    const { addOnId } = req.params;

    const addOn = await AddOn.findByIdAndDelete(addOnId);
    if (!addOn) {
      return res.status(404).json({
        success: false,
        message: 'Add-on not found'
      });
    }

    res.json({
      success: true,
      message: 'Add-on deleted successfully'
    });
  } catch (error) {
    console.error('Delete add-on error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete add-on'
    });
  }
};

export const getAllAddOns = async (req, res) => {
  try {
    const addOns = await AddOn.find()
      .populate('applicableServices', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: addOns
    });
  } catch (error) {
    console.error('Get add-ons error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch add-ons'
    });
  }
};

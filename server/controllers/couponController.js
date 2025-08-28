import Coupon from '../models/Coupon.js';
import User from '../models/User.js';

// Admin: Get all coupons
export const getAllCoupons = async (req, res) => {
  try {
    const { page = 1, limit = 10, type, isActive, search } = req.query;
    
    let query = {};
    
    // Filter by coupon type
    if (type && type !== 'all') {
      query.couponType = type;
    }
    
    // Filter by active status
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }
    
    // Search by code or name
    if (search) {
      query.$or = [
        { code: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } }
      ];
    }

    const coupons = await Coupon.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('applicableCategories', 'name')
      .populate('applicableServices', 'name');

    const total = await Coupon.countDocuments(query);

    res.json({
      success: true,
      data: {
        coupons,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get all coupons error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch coupons',
      error: error.message
    });
  }
};

// Admin: Create new coupon
export const createCoupon = async (req, res) => {
  try {
    const couponData = req.body;
    
    // Check if coupon code already exists
    const existingCoupon = await Coupon.findOne({ 
      code: couponData.code.toUpperCase() 
    });
    
    if (existingCoupon) {
      return res.status(400).json({
        success: false,
        message: 'Coupon code already exists'
      });
    }

    const coupon = new Coupon({
      ...couponData,
      code: couponData.code.toUpperCase()
    });

    await coupon.save();

    res.status(201).json({
      success: true,
      message: 'Coupon created successfully',
      data: coupon
    });
  } catch (error) {
    console.error('Create coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create coupon',
      error: error.message
    });
  }
};

// Admin: Update coupon
export const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // If updating code, check for duplicates
    if (updateData.code) {
      const existingCoupon = await Coupon.findOne({ 
        code: updateData.code.toUpperCase(),
        _id: { $ne: id }
      });
      
      if (existingCoupon) {
        return res.status(400).json({
          success: false,
          message: 'Coupon code already exists'
        });
      }
      
      updateData.code = updateData.code.toUpperCase();
    }

    const coupon = await Coupon.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    ).populate('applicableCategories', 'name')
     .populate('applicableServices', 'name');

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    res.json({
      success: true,
      message: 'Coupon updated successfully',
      data: coupon
    });
  } catch (error) {
    console.error('Update coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update coupon',
      error: error.message
    });
  }
};

// Admin: Delete coupon
export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findByIdAndDelete(id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    res.json({
      success: true,
      message: 'Coupon deleted successfully'
    });
  } catch (error) {
    console.error('Delete coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete coupon',
      error: error.message
    });
  }
};

// Admin: Toggle coupon status
export const toggleCouponStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findById(id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    coupon.isActive = !coupon.isActive;
    await coupon.save();

    res.json({
      success: true,
      message: `Coupon ${coupon.isActive ? 'activated' : 'deactivated'} successfully`,
      data: coupon
    });
  } catch (error) {
    console.error('Toggle coupon status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle coupon status',
      error: error.message
    });
  }
};

// Get available coupons for user
export const getAvailableCoupons = async (req, res) => {
  try {
    const { orderAmount, userId, serviceType } = req.query;
    const amount = orderAmount ? parseFloat(orderAmount) : 0;

    const now = new Date();
    let query = {
      isActive: true,
      validFrom: { $lte: now },
      validUntil: { $gte: now },
      $or: [
        { usageLimit: null },
        { $expr: { $lt: ['$usedCount', '$usageLimit'] } }
      ]
    };

    // Filter by service type if provided
    if (serviceType) {
      query.$or = [
        { applicableServices: { $size: 0 } }, // No specific service restriction
        { applicableServices: serviceType }
      ];
    }

    const coupons = await Coupon.find(query)
      .populate('applicableCategories', 'name')
      .populate('applicableServices', 'name')
      .sort({ priority: -1, discountValue: -1 });

    // Filter coupons applicable to the order amount and user type
    const applicableCoupons = coupons.filter(coupon => {
      // Check minimum order amount
      if (amount < coupon.minimumOrderAmount) {
        return false;
      }

      // Check target audience for new customers
      if (coupon.targetAudience === 'new_customers' && userId) {
        // Would need to check if user is new - simplified for now
        return true;
      }

      return true;
    });

    // Calculate potential discount for each coupon
    const couponsWithDiscount = applicableCoupons.map(coupon => {
      const discount = amount > 0 ? coupon.calculateDiscount(amount) : 0;
      return {
        ...coupon.toObject(),
        potentialDiscount: discount,
        couponTypeLabel: getCouponTypeLabel(coupon.couponType)
      };
    });

    res.json({
      success: true,
      data: couponsWithDiscount
    });
  } catch (error) {
    console.error('Get available coupons error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch coupons',
      error: error.message
    });
  }
};

// Helper function to get coupon type labels
const getCouponTypeLabel = (type) => {
  const labels = {
    'welcome': 'Welcome Offer',
    'festival_seasonal': 'Festival Special',
    'referral': 'Referral Bonus',
    'loyalty': 'Loyalty Reward',
    'minimum_order': 'Minimum Order Discount',
    'limited_time': 'Flash Sale',
    'service_specific': 'Service Special'
  };
  return labels[type] || 'Special Offer';
};

// Validate coupon
export const validateCoupon = async (req, res) => {
  try {
    const { code, orderAmount } = req.body;

    if (!code || !orderAmount) {
      return res.status(400).json({
        success: false,
        message: 'Coupon code and order amount are required'
      });
    }

    const coupon = await Coupon.findOne({ 
      code: code.toUpperCase(),
      isActive: true 
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Invalid coupon code'
      });
    }

    if (!coupon.isValid()) {
      return res.status(400).json({
        success: false,
        message: 'Coupon has expired or reached usage limit'
      });
    }

    if (orderAmount < coupon.minimumOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount of ₹${coupon.minimumOrderAmount} required for this coupon`
      });
    }

    // Check user usage limit
    const Order = (await import('../models/Order.js')).default;
    const userOrdersWithCoupon = await Order.countDocuments({
      userId: req.user.id,
      couponCode: code.toUpperCase()
    });

    if (userOrdersWithCoupon >= coupon.userUsageLimit) {
      return res.status(400).json({
        success: false,
        message: 'You have already used this coupon the maximum number of times'
      });
    }

    const discountAmount = coupon.calculateDiscount(orderAmount);

    res.json({
      success: true,
      message: 'Coupon is valid',
      data: {
        isValid: true,
        coupon: {
          code: coupon.code,
          name: coupon.name,
          description: coupon.description,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue
        },
        discountAmount,
        finalAmount: orderAmount - discountAmount
      }
    });
  } catch (error) {
    console.error('Validate coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to validate coupon',
      error: error.message
    });
  }
};

// Apply coupon (for immediate discount calculation)
export const applyCoupon = async (req, res) => {
  try {
    const { code, orderAmount, items } = req.body;

    if (!code || !orderAmount) {
      return res.status(400).json({
        success: false,
        message: 'Coupon code and order amount are required'
      });
    }

    const coupon = await Coupon.findOne({ 
      code: code.toUpperCase(),
      isActive: true 
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Invalid coupon code'
      });
    }

    if (!coupon.isValid()) {
      return res.status(400).json({
        success: false,
        message: 'Coupon has expired or reached usage limit'
      });
    }

    if (orderAmount < coupon.minimumOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount of ₹${coupon.minimumOrderAmount} required for this coupon`
      });
    }

    // Check if coupon is applicable to the items/categories
    if (coupon.applicableCategories.length > 0 || coupon.applicableServices.length > 0) {
      // Implementation for category/service specific coupons
      // This would require checking if the order items match the coupon criteria
    }

    const discountAmount = coupon.calculateDiscount(orderAmount);

    res.json({
      success: true,
      message: 'Coupon applied successfully',
      data: {
        coupon: {
          code: coupon.code,
          name: coupon.name,
          description: coupon.description,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue
        },
        originalAmount: orderAmount,
        discountAmount,
        finalAmount: orderAmount - discountAmount,
        savings: discountAmount
      }
    });
  } catch (error) {
    console.error('Apply coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to apply coupon',
      error: error.message
    });
  }
};

// Get coupon by code (public)
export const getCouponByCode = async (req, res) => {
  try {
    const { code } = req.params;

    const coupon = await Coupon.findOne({ 
      code: code.toUpperCase(),
      isActive: true 
    }).select('-usedCount'); // Don't expose usage statistics

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    res.json({
      success: true,
      data: coupon
    });
  } catch (error) {
    console.error('Get coupon by code error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch coupon',
      error: error.message
    });
  }
};

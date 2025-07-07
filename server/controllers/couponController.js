import Coupon from '../models/Coupon.js';

// Get available coupons for user
export const getAvailableCoupons = async (req, res) => {
  try {
    const { orderAmount } = req.query;
    const amount = orderAmount ? parseFloat(orderAmount) : 0;

    const now = new Date();
    const coupons = await Coupon.find({
      isActive: true,
      validFrom: { $lte: now },
      validUntil: { $gte: now },
      $or: [
        { usageLimit: null },
        { $expr: { $lt: ['$usedCount', '$usageLimit'] } }
      ]
    }).sort({ discountValue: -1 });

    // Filter coupons applicable to the order amount
    const applicableCoupons = coupons.filter(coupon => {
      return amount >= coupon.minimumOrderAmount;
    });

    // Calculate potential discount for each coupon
    const couponsWithDiscount = applicableCoupons.map(coupon => {
      const discount = amount > 0 ? coupon.calculateDiscount(amount) : 0;
      return {
        ...coupon.toObject(),
        potentialDiscount: discount
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

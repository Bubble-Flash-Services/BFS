import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import User from '../models/User.js';
import Coupon from '../models/Coupon.js';
import Service from '../models/Service.js';
import Package from '../models/Package.js';
import AddOn from '../models/AddOn.js';

// Create new order
export const createOrder = async (req, res) => {
  try {
    const {
      items, // Can be from cart or direct items
      serviceAddress,
      scheduledDate,
      scheduledTimeSlot,
      paymentMethod,
      couponCode,
      customerNotes
    } = req.body;

    let orderItems = [];
    let subtotal = 0;

    // If items are not provided, get from cart
    if (!items || items.length === 0) {
      const cart = await Cart.findOne({ userId: req.user.id })
        .populate('items.serviceId')
        .populate('items.packageId')
        .populate('items.addOns.addOnId');

      if (!cart || cart.items.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No items found in cart'
        });
      }

      orderItems = cart.items;
      subtotal = cart.totalAmount;
    } else {
      // Process provided items
      for (const item of items) {
        const service = await Service.findById(item.serviceId);
        if (!service) {
          return res.status(404).json({
            success: false,
            message: `Service not found: ${item.serviceId}`
          });
        }

        let packageData = null;
        let price = service.basePrice;
        let packageName = null;

        if (item.packageId) {
          packageData = await Package.findById(item.packageId);
          if (!packageData) {
            return res.status(404).json({
              success: false,
              message: `Package not found: ${item.packageId}`
            });
          }
          price = packageData.price;
          packageName = packageData.name;
        }

        // Process add-ons
        const processedAddOns = [];
        let addOnTotal = 0;
        if (item.addOns && item.addOns.length > 0) {
          for (const addOn of item.addOns) {
            const addOnData = await AddOn.findById(addOn.addOnId);
            if (addOnData) {
              const addOnPrice = addOnData.price * (addOn.quantity || 1);
              processedAddOns.push({
                addOnId: addOn.addOnId,
                name: addOnData.name,
                quantity: addOn.quantity || 1,
                price: addOnData.price
              });
              addOnTotal += addOnPrice;
            }
          }
        }

        // Calculate laundry items total
        let laundryTotal = 0;
        if (item.laundryItems && item.laundryItems.length > 0) {
          item.laundryItems.forEach(laundryItem => {
            laundryTotal += laundryItem.pricePerItem * laundryItem.quantity;
          });
        }

        const itemTotal = (price * item.quantity) + addOnTotal + laundryTotal;
        subtotal += itemTotal;

        orderItems.push({
          serviceId: item.serviceId,
          packageId: item.packageId,
          serviceName: service.name,
          packageName,
          quantity: item.quantity,
          price: price,
          addOns: processedAddOns,
          laundryItems: item.laundryItems || [],
          vehicleType: item.vehicleType,
          specialInstructions: item.specialInstructions
        });
      }
    }

    // Apply coupon if provided
    let discountAmount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ 
        code: couponCode.toUpperCase(),
        isActive: true 
      });

      if (!coupon || !coupon.isValid()) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired coupon'
        });
      }

      // Check user usage limit
      const userOrdersWithCoupon = await Order.countDocuments({
        userId: req.user.id,
        couponCode: couponCode.toUpperCase()
      });

      if (userOrdersWithCoupon >= coupon.userUsageLimit) {
        return res.status(400).json({
          success: false,
          message: 'Coupon usage limit exceeded'
        });
      }

      discountAmount = coupon.calculateDiscount(subtotal);
      
      // Update coupon usage
      coupon.usedCount += 1;
      await coupon.save();
    }

    const totalAmount = subtotal - discountAmount;

    // Create order
    const order = new Order({
      userId: req.user.id,
      items: orderItems,
      serviceAddress,
      scheduledDate: new Date(scheduledDate),
      scheduledTimeSlot,
      subtotal,
      discountAmount,
      couponCode: couponCode?.toUpperCase(),
      totalAmount,
      paymentMethod,
      customerNotes,
      estimatedDuration: orderItems.reduce((total, item) => {
        return total + (item.packageId ? 60 : 30); // Default durations
      }, 0)
    });

    await order.save();

    // Clear cart if items were from cart
    if (!items || items.length === 0) {
      await Cart.findOneAndDelete({ userId: req.user.id });
    }

    // Update user stats
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { 
        totalOrders: 1,
        totalSpent: totalAmount,
        loyaltyPoints: Math.floor(totalAmount / 10) // 1 point per ₹10
      }
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
};

// Get user orders
export const getUserOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;

    const filter = { userId: req.user.id };
    if (status) {
      filter.orderStatus = status;
    }

    const orders = await Order.find(filter)
      .populate('items.serviceId', 'name')
      .populate('items.packageId', 'name')
      .populate('assignedEmployee', 'name phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalOrders = await Order.countDocuments(filter);
    const totalPages = Math.ceil(totalOrders / limit);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalOrders,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
};

// Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({
      _id: orderId,
      userId: req.user.id
    })
      .populate('items.serviceId', 'name description')
      .populate('items.packageId', 'name description features')
      .populate('items.addOns.addOnId', 'name description')
      .populate('assignedEmployee', 'name phone profileImage rating');

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
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message
    });
  }
};

// Cancel order
export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;

    const order = await Order.findOne({
      _id: orderId,
      userId: req.user.id
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if order can be cancelled
    if (!['pending', 'confirmed'].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage'
      });
    }

    order.orderStatus = 'cancelled';
    order.customerNotes = reason || 'Cancelled by customer';
    await order.save();

    // Process refund if payment was completed
    if (order.paymentStatus === 'completed') {
      order.paymentStatus = 'refunded';
      await order.save();
      
      // Here you would integrate with payment gateway for refund
      // For now, we'll just mark it as refunded
    }

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order',
      error: error.message
    });
  }
};

// Submit order review
export const submitOrderReview = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { rating, review } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    const order = await Order.findOne({
      _id: orderId,
      userId: req.user.id,
      orderStatus: 'completed'
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or not completed'
      });
    }

    if (order.isReviewSubmitted) {
      return res.status(400).json({
        success: false,
        message: 'Review already submitted for this order'
      });
    }

    order.rating = rating;
    order.review = review;
    order.isReviewSubmitted = true;
    await order.save();

    // Update employee rating if assigned
    if (order.assignedEmployee) {
      const Employee = (await import('../models/Employee.js')).default;
      const employee = await Employee.findById(order.assignedEmployee);
      if (employee) {
        const totalRatedOrders = await Order.countDocuments({
          assignedEmployee: employee._id,
          isReviewSubmitted: true
        });
        
        const totalRatingSum = await Order.aggregate([
          { $match: { assignedEmployee: employee._id, isReviewSubmitted: true } },
          { $group: { _id: null, totalRating: { $sum: '$rating' } } }
        ]);

        const newRating = totalRatingSum[0]?.totalRating / totalRatedOrders || 0;
        employee.rating = Math.round(newRating * 10) / 10; // Round to 1 decimal
        await employee.save();
      }
    }

    res.json({
      success: true,
      message: 'Review submitted successfully',
      data: order
    });
  } catch (error) {
    console.error('Submit review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit review',
      error: error.message
    });
  }
};

// Update payment status (for payment gateway webhooks)
export const updatePaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { paymentStatus, paymentId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.paymentStatus = paymentStatus;
    if (paymentId) {
      order.paymentId = paymentId;
    }

    // If payment is successful, confirm the order
    if (paymentStatus === 'completed') {
      order.orderStatus = 'confirmed';
    }

    await order.save();

    res.json({
      success: true,
      message: 'Payment status updated successfully',
      data: order
    });
  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update payment status',
      error: error.message
    });
  }
};

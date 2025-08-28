import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import User from '../models/User.js';
import Coupon from '../models/Coupon.js';
import Service from '../models/Service.js';
import Package from '../models/Package.js';
import AddOn from '../models/AddOn.js';
import mongoose from 'mongoose';

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

    console.log('📋 Creating order with items:', items);

    let orderItems = [];
    let subtotal = 0;

    // If items are provided, process them
    if (items && items.length > 0) {
      for (const item of items) {
        console.log('🔍 Processing item:', item);
        
        let service, packageData;
        
        // Try to find service by ID first (for real database IDs)
        if (item.serviceId && mongoose.Types.ObjectId.isValid(item.serviceId)) {
          service = await Service.findById(item.serviceId);
        }
        
        // If no service found by ID, try to find by service type and name
        if (!service) {
          // Map cart types to service names
          const serviceTypeMapping = {
            'bike-wash': 'Basic Bike Wash',
            'car-wash': 'Basic Car Wash',
            'laundry': 'Laundry Service'
          };
          
          const serviceName = serviceTypeMapping[item.type] || item.serviceName || 'Basic Car Wash';
          service = await Service.findOne({ name: { $regex: serviceName, $options: 'i' } });
          
          console.log(`🔍 Found service by name "${serviceName}":`, !!service);
        }

        if (!service) {
          // Fallback to first available service
          service = await Service.findOne();
          console.log('⚠️ Using fallback service:', service?.name);
        }

        if (!service) {
          return res.status(404).json({
            success: false,
            message: 'No services available. Please contact support.'
          });
        }

        // Try to find package by ID first
        if (item.packageId && mongoose.Types.ObjectId.isValid(item.packageId)) {
          packageData = await Package.findById(item.packageId);
        }
        
        // If no package found by ID, try to find by name or use first available
        if (!packageData) {
          packageData = await Package.findOne({ service: service._id });
          console.log(`🔍 Found package for service "${service.name}":`, packageData?.name);
        }

        // Use cart data directly, do NOT override with database values
        const price = item.price || service.basePrice;
        const packageName = item.packageName || item.name || packageData?.name || 'Custom Package';
        
        // REMOVED: Database override logic that was replacing cart prices/names
        // We want to preserve the exact cart data from localStorage

        // Process add-ons (keep as provided since they're custom)
        const processedAddOns = item.addOns || [];

        // Process laundry items (keep as provided since they're custom)
        const laundryItems = item.laundryItems || [];

        // Calculate totals
        let addOnTotal = 0;
        if (processedAddOns.length > 0) {
          processedAddOns.forEach(addOn => {
            addOnTotal += (addOn.price || 0) * (addOn.quantity || 1);
          });
        }

        let laundryTotal = 0;
        if (laundryItems.length > 0) {
          laundryItems.forEach(laundryItem => {
            laundryTotal += (laundryItem.pricePerItem || 0) * (laundryItem.quantity || 1);
          });
        }

        const itemTotal = (price * (item.quantity || 1)) + addOnTotal + laundryTotal;
        subtotal += itemTotal;

        orderItems.push({
          serviceId: service._id,
          packageId: packageData?._id,
          serviceName: item.serviceName || service.name,  // Use cart name first, then fallback
          packageName: packageName,
          quantity: item.quantity || 1,
          price: price,
          addOns: processedAddOns,
          laundryItems: laundryItems,
          vehicleType: item.vehicleType || item.category || 'standard',
          specialInstructions: item.specialInstructions || item.notes || ''
        });

        console.log(`✅ Processed item: ${item.serviceName || service.name} - ${packageName} (₹${price})`);
      }
    } else {
      // If no items provided, try to get from cart (existing logic)
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

    // Generate order number
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const orderNumber = `BFS${timestamp.slice(-6)}${random}`;

    // Create order
    const order = new Order({
      orderNumber,
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
        totalSpent: totalAmount
      }
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    console.error('Create order error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      requestBody: req.body
    });
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
      .populate('items.addOns.addOnId', 'name description');

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

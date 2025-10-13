import GreenBooking from '../models/GreenBooking.js';
import GreenService from '../models/GreenService.js';
import Branch from '../models/Branch.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { geocodeAddress, getPincodeCoordinates } from '../services/geocodeService.js';
import { 
  findNearestBranch, 
  calculateDistanceCharge, 
  validateServiceAvailability,
  isInsideBangalore 
} from '../services/distanceService.js';
import { autoAssignProvider } from '../services/assignmentService.js';
import { broadcastToAdmins } from '../services/telegramService.js';

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

/**
 * Create a new green booking
 * POST /api/green/booking
 */
export const createGreenBooking = async (req, res) => {
  try {
    const {
      serviceName,
      serviceCategory,
      serviceId,
      userName,
      userPhone,
      address,
      pincode,
      scheduledAt,
      notes,
      basePrice
    } = req.body;

    // Validate required fields
    if (!serviceName || !userName || !userPhone || !address || !pincode || !basePrice) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Get service details
    const service = await GreenService.findById(serviceId);
    if (!service || !service.active) {
      return res.status(404).json({
        success: false,
        message: 'Service not found or inactive'
      });
    }

    // Geocode the address
    let coordinates = null;
    try {
      coordinates = await geocodeAddress(`${address}, ${pincode}, Bengaluru`);
      
      // Fallback to pincode geocoding if full address fails
      if (!coordinates) {
        coordinates = await getPincodeCoordinates(pincode);
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }

    if (!coordinates) {
      return res.status(400).json({
        success: false,
        message: 'Unable to locate address. Please verify the address and pincode.'
      });
    }

    // Find nearest branch
    const branches = await Branch.find({ isActive: true });
    const { branch, distance } = findNearestBranch(branches, coordinates.lat, coordinates.lng);

    if (!branch) {
      return res.status(503).json({
        success: false,
        message: 'No service centers available at the moment'
      });
    }

    // Calculate distance charge
    const insideBangalore = isInsideBangalore(pincode);
    const distanceCharge = calculateDistanceCharge(distance, insideBangalore);

    // Validate service availability
    const availability = validateServiceAvailability(distance, pincode);
    if (!availability.available) {
      return res.status(400).json({
        success: false,
        message: availability.reason
      });
    }

    if (distanceCharge === null) {
      return res.status(400).json({
        success: false,
        message: 'Service not available in this area'
      });
    }

    // Calculate total amount
    const totalAmount = basePrice + distanceCharge;

    // Generate booking number (same pattern as Order model)
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const bookingNumber = `BFSG${timestamp.slice(-6)}${random}`;

    // Create booking
    const booking = new GreenBooking({
      bookingNumber: bookingNumber,
      user: {
        name: userName,
        phone: userPhone,
        userId: req.user?.id || null
      },
      serviceId: service._id,
      serviceName: serviceName,
      serviceCategory: serviceCategory || service.category,
      branchId: branch._id,
      address: {
        full: address,
        lat: coordinates.lat,
        lng: coordinates.lng,
        pincode: pincode,
        city: 'Bengaluru'
      },
      distanceKm: distance,
      distanceCharge: distanceCharge,
      basePrice: basePrice,
      totalAmount: totalAmount,
      scheduledAt: scheduledAt || new Date(),
      notes: notes || '',
      status: 'created'
    });

    // Save booking
    await booking.save();

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100), // Convert to paise
      currency: 'INR',
      receipt: booking.bookingNumber,
      notes: {
        bookingId: booking._id.toString(),
        bookingNumber: booking.bookingNumber,
        service: serviceName
      }
    });

    // Update booking with Razorpay order ID
    booking.payment.razorpayOrderId = razorpayOrder.id;
    await booking.save();

    // Send Telegram notification to admins
    try {
      const message = `🆕 *New Green & Clean Booking*\n\n` +
        `📋 Booking: #${booking.bookingNumber}\n` +
        `👤 Customer: ${userName}\n` +
        `📱 Phone: ${userPhone}\n` +
        `🧹 Service: ${serviceName}\n` +
        `💰 Amount: ₹${totalAmount} (Base: ₹${basePrice} + Distance: ₹${distanceCharge})\n` +
        `📍 Address: ${address}, ${pincode}\n` +
        `📏 Distance: ${distance} km from ${branch.name}\n` +
        `📅 Scheduled: ${new Date(booking.scheduledAt).toLocaleString('en-IN')}\n` +
        `📝 Notes: ${notes || 'None'}`;

      await broadcastToAdmins(message);
    } catch (error) {
      console.error('Telegram notification error:', error);
    }

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: {
        booking: {
          id: booking._id,
          bookingNumber: booking.bookingNumber,
          totalAmount: booking.totalAmount,
          distanceCharge: booking.distanceCharge,
          nearestBranch: branch.name,
          distanceKm: distance
        },
        razorpay: {
          orderId: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          key: process.env.RAZORPAY_KEY_ID
        }
      }
    });
  } catch (error) {
    console.error('Error creating green booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create booking',
      error: error.message
    });
  }
};

/**
 * Verify payment and confirm booking
 * POST /api/green/booking/:id/pay
 */
export const verifyGreenPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    // Find booking
    const booking = await GreenBooking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      booking.payment.status = 'failed';
      await booking.save();

      return res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }

    // Update booking
    booking.payment.razorpayPaymentId = razorpay_payment_id;
    booking.payment.status = 'paid';
    await booking.save();

    // Auto-assign provider
    const assignmentResult = await autoAssignProvider(booking);

    // Notify admin about payment confirmation
    try {
      const message = `✅ *Payment Confirmed*\n\n` +
        `📋 Booking: #${booking.bookingNumber}\n` +
        `💳 Payment ID: ${razorpay_payment_id}\n` +
        `💰 Amount: ₹${booking.totalAmount}\n` +
        `${assignmentResult.success ? `👷 Assigned to: ${assignmentResult.provider.name}` : '⚠️ Manual assignment required'}`;

      await broadcastToAdmins(message);
    } catch (error) {
      console.error('Telegram notification error:', error);
    }

    res.json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        booking: {
          id: booking._id,
          bookingNumber: booking.bookingNumber,
          status: booking.status,
          paymentStatus: booking.payment.status
        },
        assignment: assignmentResult
      }
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message
    });
  }
};

/**
 * Get booking by ID
 * GET /api/green/booking/:id
 */
export const getGreenBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await GreenBooking.findById(id)
      .populate('serviceId')
      .populate('branchId')
      .populate('providerId');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking',
      error: error.message
    });
  }
};

/**
 * Get booking by phone number
 * GET /api/green/booking/phone/:phone
 */
export const getGreenBookingsByPhone = async (req, res) => {
  try {
    const { phone } = req.params;

    const bookings = await GreenBooking.find({ 'user.phone': phone })
      .populate('serviceId')
      .populate('branchId')
      .populate('providerId')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: bookings
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
      error: error.message
    });
  }
};

/**
 * Update booking status
 * PUT /api/green/booking/:id/status
 */
export const updateGreenBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, beforeImages, afterImages, notes } = req.body;

    const booking = await GreenBooking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Update status
    booking.status = status;

    if (beforeImages) {
      booking.beforeImages = beforeImages;
    }

    if (afterImages) {
      booking.afterImages = afterImages;
    }

    if (notes) {
      booking.adminNotes = notes;
    }

    if (status === 'completed') {
      booking.completedAt = new Date();
    }

    if (status === 'cancelled') {
      booking.cancelledAt = new Date();
    }

    await booking.save();

    res.json({
      success: true,
      message: 'Booking status updated',
      data: booking
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update booking',
      error: error.message
    });
  }
};

import KeyServiceBooking from '../models/KeyServiceBooking.js';

// Service pricing configuration
const SERVICE_PRICES = {
  'key-duplication': {
    'house-key': 99,
    'bike-key': 149,
    'car-key': 299,
    'cupboard-key': 79,
    'mailbox-key': 69,
    'padlock-key': 49
  },
  'lock-services': {
    'emergency-lock-opening': { day: 499, night: 799 },
    'lock-repair': 299,
    'lock-replacement': 599, // + lock cost
    'lock-installation': 399  // + lock cost
  },
  'advanced-services': {
    'safe-key-services': 1999,
    'digital-lock-programming': 799,
    'master-key-system': 2999,
    'lock-rekeying': 399
  },
  'specialized-keys': {
    'car-remote-key': 1499,
    'transponder-key': 2499,
    'smart-key-fob': 3499
  }
};

// Calculate price based on service type and details
function calculatePrice(serviceType, specificService, quantity = 1, nightService = false) {
  let basePrice = 0;
  let nightSurcharge = 0;

  const categoryPrices = SERVICE_PRICES[serviceType];
  if (!categoryPrices) {
    return { basePrice: 0, nightSurcharge: 0, totalPrice: 0 };
  }

  const servicePrice = categoryPrices[specificService];
  
  if (typeof servicePrice === 'object' && servicePrice.day) {
    // Handle emergency lock opening with day/night pricing
    basePrice = nightService ? servicePrice.night : servicePrice.day;
  } else if (typeof servicePrice === 'number') {
    basePrice = servicePrice * quantity;
  }

  // Add night surcharge for emergency services if applicable
  if (nightService && specificService === 'emergency-lock-opening') {
    nightSurcharge = servicePrice.night - servicePrice.day;
  }

  const totalPrice = basePrice;

  return {
    basePrice: typeof servicePrice === 'object' ? servicePrice.day * quantity : basePrice,
    nightSurcharge,
    totalPrice
  };
}

// Generate verification code for technician
function generateVerificationCode() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// Get price quote without creating booking
export const getPriceQuote = async (req, res) => {
  try {
    const { serviceType, specificService, quantity, nightService } = req.body;

    if (!serviceType || !specificService) {
      return res.status(400).json({
        success: false,
        message: 'Service type and specific service are required'
      });
    }

    const pricing = calculatePrice(
      serviceType,
      specificService,
      quantity || 1,
      nightService || false
    );

    res.json({
      success: true,
      data: pricing
    });
  } catch (error) {
    console.error('Error calculating quote:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate quote',
      error: error.message
    });
  }
};

// Create new booking
export const createBooking = async (req, res) => {
  try {
    const {
      serviceType,
      specificService,
      keyType,
      quantity,
      isEmergency,
      nightService,
      serviceLocation,
      contactPhone,
      alternateContact,
      preferredTime,
      keyPhoto,
      specialInstructions,
      idProof
    } = req.body;

    // Validate required fields
    if (!serviceType || !specificService || !serviceLocation || !contactPhone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Validate service type
    const validServiceTypes = ['key-duplication', 'lock-services', 'advanced-services', 'specialized-keys'];
    if (!validServiceTypes.includes(serviceType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid service type'
      });
    }

    // For emergency bookings, skip time preference validation
    if (!isEmergency && preferredTime) {
      const selectedTime = new Date(preferredTime);
      const now = new Date();
      
      if (selectedTime < now) {
        return res.status(400).json({
          success: false,
          message: 'Preferred time must be in the future'
        });
      }
    }

    // Calculate pricing
    const pricing = calculatePrice(
      serviceType,
      specificService,
      quantity || 1,
      nightService || false
    );

    // Generate verification code
    const verificationCode = generateVerificationCode();

    // Create booking
    const booking = new KeyServiceBooking({
      userId: req.user._id,
      serviceType,
      specificService,
      keyType,
      quantity: quantity || 1,
      isEmergency: isEmergency || false,
      nightService: nightService || false,
      serviceLocation,
      contactPhone,
      alternateContact,
      preferredTime: !isEmergency ? preferredTime : null,
      keyPhoto,
      specialInstructions,
      pricing,
      verificationCode,
      idProof
    });

    await booking.save();

    res.status(201).json({
      success: true,
      message: isEmergency 
        ? 'Emergency booking created! Technician will contact you shortly.' 
        : 'Booking created successfully',
      data: {
        bookingId: booking._id,
        verificationCode: booking.verificationCode,
        pricing: booking.pricing,
        status: booking.status,
        isEmergency: booking.isEmergency
      }
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create booking',
      error: error.message
    });
  }
};

// Get user's bookings
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await KeyServiceBooking.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('assignedTechnician', 'name phone')
      .select('-__v');

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

// Get specific booking details
export const getBookingById = async (req, res) => {
  try {
    const booking = await KeyServiceBooking.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).populate('assignedTechnician', 'name phone email');

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

// Cancel booking
export const cancelBooking = async (req, res) => {
  try {
    const booking = await KeyServiceBooking.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled'
      });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel a completed booking'
      });
    }

    if (booking.status === 'in-progress') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel a booking that is in progress'
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel booking',
      error: error.message
    });
  }
};

// Add review and rating
export const addReview = async (req, res) => {
  try {
    const { rating, review } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid rating (1-5)'
      });
    }

    const booking = await KeyServiceBooking.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only review completed bookings'
      });
    }

    booking.rating = rating;
    booking.review = review;
    await booking.save();

    res.json({
      success: true,
      message: 'Review added successfully',
      data: booking
    });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add review',
      error: error.message
    });
  }
};

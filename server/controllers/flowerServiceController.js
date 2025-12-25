import FlowerBooking from '../models/FlowerBooking.js';

// Service pricing configuration
const SERVICE_PRICES = {
  'bouquet': {
    'classic-bouquet': {
      'rose-bouquet': { min: 499, max: 999 },
      'mixed-flower-bouquet': { min: 499, max: 999 },
      'seasonal-flower-bouquet': { min: 499, max: 999 }
    },
    'love-couple-bouquet': {
      'red-rose-bouquet': { min: 799, max: 1499 },
      'heart-style-bouquet': { min: 799, max: 1499 },
      'rose-filler-flowers': { min: 799, max: 1499 }
    },
    'premium-bouquet': {
      'imported-exotic-flowers': { min: 1499, max: 2999 },
      'designer-wrapping': { min: 1499, max: 2999 },
      'bigger-size-bouquets': { min: 1499, max: 2999 }
    }
  },
  'gift-box': {
    'gift-box': {
      'teddy-bears': { min: 399, max: 1999 },
      'chocolate-boxes': { min: 399, max: 1999 },
      'greeting-cards': { min: 399, max: 1999 },
      'perfumes': { min: 399, max: 1999 },
      'soft-toys': { min: 399, max: 1999 }
    },
    'photo-gift': {
      'printed-photo-frames': { min: 299, max: 999 },
      'mini-photo-albums': { min: 299, max: 999 },
      'personalized-photo-cards': { min: 299, max: 999 }
    },
    'love-surprise-box': {
      'bouquet-teddy': { min: 999, max: 2499 },
      'bouquet-chocolates': { min: 999, max: 2499 },
      'bouquet-photo-gift': { min: 999, max: 2499 }
    }
  },
  'decoration': {
    'birthday-decoration': {
      'balloon-decoration': { min: 1499, max: 3999 },
      'name-banner': { min: 1499, max: 3999 },
      'table-room-decor': { min: 1499, max: 3999 }
    },
    'couple-decoration': {
      'romantic-balloon-decor': { min: 1999, max: 4999 },
      'rose-petals': { min: 1999, max: 4999 },
      'led-lights': { min: 1999, max: 4999 }
    },
    'party-decoration': {
      'small-home-parties': { min: 2999, max: 5999 },
      'surprise-celebrations': { min: 2999, max: 5999 },
      'family-functions': { min: 2999, max: 5999 }
    }
  },
  'bulk-event': {
    'bulk-event': {
      'pooja-flowers': { min: 999, max: 9999, customPricing: true },
      'welcome-bouquets': { min: 999, max: 9999, customPricing: true },
      'stage-flower-bunches': { min: 999, max: 9999, customPricing: true }
    }
  }
};

// Late night delivery surcharge configuration
const LATE_NIGHT_SURCHARGE = {
  min: 299,
  max: 499
};

// Calculate price based on service details
function calculatePrice(serviceType, category, itemName, quantity = 1, isLateNight = false, customizationRequested = false) {
  let basePrice = 0;
  let lateNightSurcharge = 0;
  let customizationCharge = 0;

  const categoryPrices = SERVICE_PRICES[serviceType]?.[category];
  if (!categoryPrices) {
    return { basePrice: 0, lateNightSurcharge: 0, customizationCharge: 0, totalPrice: 0 };
  }

  const itemPrice = categoryPrices[itemName];
  
  if (itemPrice) {
    // Use minimum price as base
    basePrice = itemPrice.min * quantity;
    
    // Add late night surcharge if applicable
    if (isLateNight) {
      lateNightSurcharge = LATE_NIGHT_SURCHARGE.min;
    }
    
    // Add customization charge if applicable
    if (customizationRequested) {
      customizationCharge = 199; // Flat customization charge
    }
  }

  const totalPrice = basePrice + lateNightSurcharge + customizationCharge;

  return {
    basePrice,
    lateNightSurcharge,
    customizationCharge,
    totalPrice
  };
}

// Get price quote without creating booking
export const getPriceQuote = async (req, res) => {
  try {
    const { serviceType, category, itemName, quantity, isLateNight, hasCustomization } = req.body;

    if (!serviceType || !category || !itemName) {
      return res.status(400).json({
        success: false,
        message: 'Service type, category, and item name are required'
      });
    }

    const pricing = calculatePrice(
      serviceType,
      category,
      itemName,
      quantity || 1,
      isLateNight || false,
      hasCustomization || false
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
      category,
      itemName,
      quantity,
      customization,
      serviceLocation,
      contactPhone,
      alternateContact,
      deliveryDate,
      deliveryTime,
      isLateNightDelivery,
      isSeasonalItem,
      seasonalNotes,
      specialInstructions
    } = req.body;

    // Validate required fields
    if (!serviceType || !category || !itemName || !serviceLocation || !contactPhone || !deliveryDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Validate service type
    const validServiceTypes = ['bouquet', 'gift-box', 'decoration', 'bulk-event'];
    if (!validServiceTypes.includes(serviceType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid service type'
      });
    }

    // Validate delivery date
    const selectedDate = new Date(deliveryDate);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    if (selectedDate < now) {
      return res.status(400).json({
        success: false,
        message: 'Delivery date must be today or in the future'
      });
    }

    // Calculate pricing
    const hasCustomization = customization && (customization.message || customization.photoUrl || customization.theme);
    const pricing = calculatePrice(
      serviceType,
      category,
      itemName,
      quantity || 1,
      isLateNightDelivery || false,
      hasCustomization
    );

    // Create booking
    const booking = new FlowerBooking({
      userId: req.user._id,
      serviceType,
      category,
      itemName,
      specificService: itemName,
      quantity: quantity || 1,
      customization: customization || {},
      serviceLocation,
      contactPhone,
      alternateContact,
      deliveryDate,
      deliveryTime: deliveryTime || 'anytime',
      isLateNightDelivery: isLateNightDelivery || false,
      isSeasonalItem: isSeasonalItem || false,
      seasonalNotes,
      pricing
    });

    await booking.save();

    res.status(201).json({
      success: true,
      message: 'Flower booking created successfully',
      data: {
        bookingId: booking._id,
        pricing: booking.pricing,
        status: booking.status,
        deliveryDate: booking.deliveryDate
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
    const bookings = await FlowerBooking.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('assignedDeliveryPerson', 'name phone')
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
    const booking = await FlowerBooking.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).populate('assignedDeliveryPerson', 'name phone email');

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
    const booking = await FlowerBooking.findOne({
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

    if (booking.status === 'delivered') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel a delivered booking'
      });
    }

    if (booking.status === 'out-for-delivery') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel a booking that is out for delivery'
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

    const booking = await FlowerBooking.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.status !== 'delivered') {
      return res.status(400).json({
        success: false,
        message: 'Can only review delivered bookings'
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

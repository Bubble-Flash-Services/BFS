import AutoFixBooking from '../models/AutoFixBooking.js';
import User from '../models/User.js';

// Get pricing based on service type and car category
export const getPricing = async (req, res) => {
  try {
    const { serviceType, carCategory, polishingType } = req.query;
    
    // Base pricing structure
    const pricingTable = {
      'minor-dent-repair': {
        'hatchback': 999,
        'sedan': 1199,
        'mid-suv': 1399,
        'suv': 1599,
        'luxury': 1999
      },
      'scratch-repair': {
        'hatchback': 1799,
        'sedan': 1999,
        'mid-suv': 2199,
        'suv': 2399,
        'luxury': 2999
      },
      'bumper-repair': {
        'hatchback': 2499,
        'sedan': 2799,
        'mid-suv': 2999,
        'suv': 3299,
        'luxury': 3999
      },
      'rubbing-polishing': {
        'single-panel': 799,
        'full-rubbing': 1499,
        'full-polishing': 2499
      }
    };
    
    let basePrice = 0;
    
    if (serviceType === 'rubbing-polishing' && polishingType) {
      basePrice = pricingTable[serviceType][polishingType] || 0;
    } else if (serviceType && carCategory) {
      basePrice = pricingTable[serviceType]?.[carCategory] || 0;
    }
    
    res.json({
      success: true,
      data: {
        basePrice,
        serviceType,
        carCategory,
        polishingType
      }
    });
  } catch (error) {
    console.error('Error getting pricing:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get pricing'
    });
  }
};

// Create booking
export const createBooking = async (req, res) => {
  try {
    const userId = req.user.userId;
    const bookingData = req.body;
    
    // Check if this is user's first order
    const existingOrders = await AutoFixBooking.countDocuments({ userId });
    const isFirstOrder = existingOrders === 0;
    
    // Calculate pricing with first order discount
    let finalPrice = bookingData.pricing.basePrice;
    let discount = 0;
    let discountPercentage = 0;
    
    if (isFirstOrder) {
      discountPercentage = 15;
      discount = Math.round((finalPrice * discountPercentage) / 100);
      finalPrice = finalPrice - discount;
    }
    
    const booking = new AutoFixBooking({
      ...bookingData,
      userId,
      pricing: {
        basePrice: bookingData.pricing.basePrice,
        discount,
        discountPercentage,
        finalPrice,
        isFirstOrder
      }
    });
    
    await booking.save();
    
    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: { booking }
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create booking'
    });
  }
};

// Get user bookings
export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const bookings = await AutoFixBooking.find({ userId })
      .sort({ createdAt: -1 })
      .populate('assignedTechnician', 'name phone');
    
    res.json({
      success: true,
      data: { bookings }
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings'
    });
  }
};

// Get booking by ID
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    
    const booking = await AutoFixBooking.findOne({ _id: id, userId })
      .populate('assignedTechnician', 'name phone');
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    res.json({
      success: true,
      data: { booking }
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking'
    });
  }
};

// Cancel booking
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    
    const booking = await AutoFixBooking.findOne({ _id: id, userId });
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    if (booking.status === 'completed' || booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel this booking'
      });
    }
    
    booking.status = 'cancelled';
    await booking.save();
    
    res.json({
      success: true,
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel booking'
    });
  }
};

// Add review
export const addReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const { rating, review } = req.body;
    
    const booking = await AutoFixBooking.findOne({ _id: id, userId });
    
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
      message: 'Review added successfully'
    });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add review'
    });
  }
};

// Get car categories
export const getCarCategories = async (req, res) => {
  try {
    const categories = [
      { id: 'hatchback', name: 'Hatchback', description: 'Compact cars' },
      { id: 'sedan', name: 'Sedan', description: 'Standard sedans' },
      { id: 'mid-suv', name: 'Mid-SUV', description: 'Compact SUVs' },
      { id: 'suv', name: 'SUV', description: 'Full-size SUVs' },
      { id: 'luxury', name: 'Luxury', description: 'Premium vehicles' }
    ];
    
    res.json({
      success: true,
      data: { categories }
    });
  } catch (error) {
    console.error('Error getting categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get categories'
    });
  }
};

// Check if user is first time customer
export const checkFirstTimeUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const existingOrders = await AutoFixBooking.countDocuments({ userId });
    const isFirstTime = existingOrders === 0;
    
    res.json({
      success: true,
      data: { isFirstTime }
    });
  } catch (error) {
    console.error('Error checking first time user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check user status'
    });
  }
};

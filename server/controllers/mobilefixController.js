import MobileFixBooking from '../models/MobileFixBooking.js';
import PhoneBrand from '../models/PhoneBrand.js';
import PhoneModel from '../models/PhoneModel.js';
import MobileFixPricing from '../models/MobileFixPricing.js';

export const getPhoneBrands = async (req, res) => {
  try {
    const brands = await PhoneBrand.find({ isActive: true })
      .sort({ displayOrder: 1, name: 1 });
    
    res.json({
      success: true,
      data: { brands }
    });
  } catch (error) {
    console.error('Error fetching phone brands:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch phone brands'
    });
  }
};

export const getModelsByBrand = async (req, res) => {
  try {
    const { brandId } = req.params;
    
    const models = await PhoneModel.find({ brandId, isActive: true })
      .sort({ displayOrder: 1, name: 1 });
    
    res.json({
      success: true,
      data: { models }
    });
  } catch (error) {
    console.error('Error fetching phone models:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch phone models'
    });
  }
};

export const getPricing = async (req, res) => {
  try {
    const { modelId, serviceType } = req.query;
    
    if (!modelId || !serviceType) {
      return res.status(400).json({
        success: false,
        message: 'Model ID and service type are required'
      });
    }
    
    const pricing = await MobileFixPricing.findOne({
      modelId,
      serviceType,
      isActive: true
    }).populate('modelId');
    
    if (!pricing) {
      return res.status(404).json({
        success: false,
        message: 'Pricing not found for this model and service'
      });
    }
    
    res.json({
      success: true,
      data: {
        price: pricing.price,
        estimatedTime: pricing.estimatedTime,
        serviceType: pricing.serviceType,
        modelId: pricing.modelId._id,
        modelName: pricing.modelId.name
      }
    });
  } catch (error) {
    console.error('Error fetching pricing:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pricing'
    });
  }
};

export const getAllPricingForModel = async (req, res) => {
  try {
    const { modelId } = req.params;
    
    const pricingList = await MobileFixPricing.find({
      modelId,
      isActive: true
    }).sort({ serviceType: 1 });
    
    res.json({
      success: true,
      data: { pricingList }
    });
  } catch (error) {
    console.error('Error fetching pricing:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pricing'
    });
  }
};

export const createBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookingData = req.body;
    
    if (!bookingData.brandId || !bookingData.modelId || !bookingData.serviceType) {
      return res.status(400).json({
        success: false,
        message: 'Brand, model, and service type are required'
      });
    }
    
    const existingOrders = await MobileFixBooking.countDocuments({ userId });
    const isFirstOrder = existingOrders === 0;
    
    let finalPrice = bookingData.pricing.basePrice;
    let discount = 0;
    let discountPercentage = 0;
    
    if (isFirstOrder) {
      discountPercentage = 15;
      discount = Math.round((finalPrice * discountPercentage) / 100);
      finalPrice = finalPrice - discount;
    }
    
    const booking = new MobileFixBooking({
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
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error: ' + error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create booking'
    });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const bookings = await MobileFixBooking.find({ userId })
      .sort({ createdAt: -1 })
      .populate('brandId', 'name')
      .populate('modelId', 'name')
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

export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const booking = await MobileFixBooking.findOne({ _id: id, userId })
      .populate('brandId', 'name')
      .populate('modelId', 'name')
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

export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const booking = await MobileFixBooking.findOne({ _id: id, userId });
    
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

export const addReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { rating, review } = req.body;
    
    const booking = await MobileFixBooking.findOne({ _id: id, userId });
    
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

export const checkFirstTimeUser = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const existingOrders = await MobileFixBooking.countDocuments({ userId });
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

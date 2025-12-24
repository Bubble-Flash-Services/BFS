import MobileFixBooking from '../models/MobileFixBooking.js';
import PhoneBrand from '../models/PhoneBrand.js';
import PhoneModel from '../models/PhoneModel.js';
import MobileFixPricing from '../models/MobileFixPricing.js';
import Employee from '../models/Employee.js';

export const getAllBookings = async (req, res) => {
  try {
    const { status } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    
    const bookings = await MobileFixBooking.find(filter)
      .sort({ createdAt: -1 })
      .populate('userId', 'name email phone')
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
    
    const booking = await MobileFixBooking.findById(id)
      .populate('userId', 'name email phone')
      .populate('brandId', 'name')
      .populate('modelId', 'name')
      .populate('assignedTechnician', 'name phone email');
    
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

export const assignTechnician = async (req, res) => {
  try {
    const { id } = req.params;
    const { technicianId, technicianETA } = req.body;
    
    const booking = await MobileFixBooking.findById(id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    booking.assignedTechnician = technicianId;
    if (technicianETA) {
      booking.technicianETA = technicianETA;
    }
    booking.status = 'assigned';
    await booking.save();
    
    res.json({
      success: true,
      message: 'Technician assigned successfully',
      data: { booking }
    });
  } catch (error) {
    console.error('Error assigning technician:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to assign technician'
    });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const booking = await MobileFixBooking.findById(id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    booking.status = status;
    
    if (status === 'in-progress' && !booking.serviceStartTime) {
      booking.serviceStartTime = new Date();
    }
    
    if (status === 'completed' && !booking.serviceEndTime) {
      booking.serviceEndTime = new Date();
    }
    
    await booking.save();
    
    res.json({
      success: true,
      message: 'Status updated successfully',
      data: { booking }
    });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update status'
    });
  }
};

export const updateAdminNotes = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminNotes } = req.body;
    
    const booking = await MobileFixBooking.findById(id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    booking.adminNotes = adminNotes;
    await booking.save();
    
    res.json({
      success: true,
      message: 'Notes updated successfully',
      data: { booking }
    });
  } catch (error) {
    console.error('Error updating notes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update notes'
    });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    
    const booking = await MobileFixBooking.findByIdAndDelete(id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete booking'
    });
  }
};

export const getStats = async (req, res) => {
  try {
    const totalBookings = await MobileFixBooking.countDocuments();
    const pending = await MobileFixBooking.countDocuments({ status: 'pending' });
    const confirmed = await MobileFixBooking.countDocuments({ status: 'confirmed' });
    const assigned = await MobileFixBooking.countDocuments({ status: 'assigned' });
    const inProgress = await MobileFixBooking.countDocuments({ status: 'in-progress' });
    const completed = await MobileFixBooking.countDocuments({ status: 'completed' });
    
    const completedBookings = await MobileFixBooking.find({ status: 'completed' });
    const totalRevenue = completedBookings.reduce((sum, booking) => sum + (booking.pricing?.finalPrice || 0), 0);
    
    const serviceTypeCounts = await MobileFixBooking.aggregate([
      {
        $group: {
          _id: '$serviceType',
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.json({
      success: true,
      data: {
        totalBookings,
        pending,
        confirmed,
        assigned,
        inProgress,
        completed,
        totalRevenue,
        serviceTypeCounts
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stats'
    });
  }
};

export const getAllBrands = async (req, res) => {
  try {
    const brands = await PhoneBrand.find().sort({ displayOrder: 1, name: 1 });
    
    res.json({
      success: true,
      data: { brands }
    });
  } catch (error) {
    console.error('Error fetching brands:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch brands'
    });
  }
};

export const createBrand = async (req, res) => {
  try {
    const { name, displayOrder } = req.body;
    
    const brand = new PhoneBrand({
      name,
      displayOrder: displayOrder || 0
    });
    
    await brand.save();
    
    res.status(201).json({
      success: true,
      message: 'Brand created successfully',
      data: { brand }
    });
  } catch (error) {
    console.error('Error creating brand:', error);
    res.status(500).json({
      success: false,
      message: error.code === 11000 ? 'Brand already exists' : 'Failed to create brand'
    });
  }
};

export const updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, isActive, displayOrder } = req.body;
    
    const brand = await PhoneBrand.findByIdAndUpdate(
      id,
      { name, isActive, displayOrder },
      { new: true, runValidators: true }
    );
    
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Brand updated successfully',
      data: { brand }
    });
  } catch (error) {
    console.error('Error updating brand:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update brand'
    });
  }
};

export const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;
    
    const modelsCount = await PhoneModel.countDocuments({ brandId: id });
    if (modelsCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete brand with existing models'
      });
    }
    
    const brand = await PhoneBrand.findByIdAndDelete(id);
    
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Brand deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting brand:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete brand'
    });
  }
};

export const getModelsByBrand = async (req, res) => {
  try {
    const { brandId } = req.params;
    
    const models = await PhoneModel.find({ brandId })
      .sort({ displayOrder: 1, name: 1 })
      .populate('brandId', 'name');
    
    res.json({
      success: true,
      data: { models }
    });
  } catch (error) {
    console.error('Error fetching models:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch models'
    });
  }
};

export const getAllModels = async (req, res) => {
  try {
    const models = await PhoneModel.find()
      .sort({ displayOrder: 1, name: 1 })
      .populate('brandId', 'name');
    
    res.json({
      success: true,
      data: { models }
    });
  } catch (error) {
    console.error('Error fetching models:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch models'
    });
  }
};

export const createModel = async (req, res) => {
  try {
    const { brandId, name, displayOrder } = req.body;
    
    const model = new PhoneModel({
      brandId,
      name,
      displayOrder: displayOrder || 0
    });
    
    await model.save();
    
    res.status(201).json({
      success: true,
      message: 'Model created successfully',
      data: { model }
    });
  } catch (error) {
    console.error('Error creating model:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create model'
    });
  }
};

export const updateModel = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, isActive, displayOrder } = req.body;
    
    const model = await PhoneModel.findByIdAndUpdate(
      id,
      { name, isActive, displayOrder },
      { new: true, runValidators: true }
    );
    
    if (!model) {
      return res.status(404).json({
        success: false,
        message: 'Model not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Model updated successfully',
      data: { model }
    });
  } catch (error) {
    console.error('Error updating model:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update model'
    });
  }
};

export const deleteModel = async (req, res) => {
  try {
    const { id } = req.params;
    
    const pricingCount = await MobileFixPricing.countDocuments({ modelId: id });
    if (pricingCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete model with existing pricing'
      });
    }
    
    const model = await PhoneModel.findByIdAndDelete(id);
    
    if (!model) {
      return res.status(404).json({
        success: false,
        message: 'Model not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Model deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting model:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete model'
    });
  }
};

export const getPricingByModel = async (req, res) => {
  try {
    const { modelId } = req.params;
    
    const pricingList = await MobileFixPricing.find({ modelId })
      .sort({ serviceType: 1 })
      .populate('modelId', 'name');
    
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

export const getAllPricing = async (req, res) => {
  try {
    const pricingList = await MobileFixPricing.find()
      .populate({
        path: 'modelId',
        populate: { path: 'brandId', select: 'name' }
      })
      .sort({ 'modelId.name': 1, serviceType: 1 });
    
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

export const createPricing = async (req, res) => {
  try {
    const { modelId, serviceType, price, estimatedTime } = req.body;
    
    const pricing = new MobileFixPricing({
      modelId,
      serviceType,
      price,
      estimatedTime
    });
    
    await pricing.save();
    
    res.status(201).json({
      success: true,
      message: 'Pricing created successfully',
      data: { pricing }
    });
  } catch (error) {
    console.error('Error creating pricing:', error);
    res.status(500).json({
      success: false,
      message: error.code === 11000 ? 'Pricing already exists for this model and service' : 'Failed to create pricing'
    });
  }
};

export const updatePricing = async (req, res) => {
  try {
    const { id } = req.params;
    const { price, estimatedTime, isActive } = req.body;
    
    const pricing = await MobileFixPricing.findByIdAndUpdate(
      id,
      { price, estimatedTime, isActive },
      { new: true, runValidators: true }
    );
    
    if (!pricing) {
      return res.status(404).json({
        success: false,
        message: 'Pricing not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Pricing updated successfully',
      data: { pricing }
    });
  } catch (error) {
    console.error('Error updating pricing:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update pricing'
    });
  }
};

export const deletePricing = async (req, res) => {
  try {
    const { id } = req.params;
    
    const pricing = await MobileFixPricing.findByIdAndDelete(id);
    
    if (!pricing) {
      return res.status(404).json({
        success: false,
        message: 'Pricing not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Pricing deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting pricing:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete pricing'
    });
  }
};

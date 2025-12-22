import AutoFixBooking from '../models/AutoFixBooking.js';
import Employee from '../models/Employee.js';

// Get all bookings with filters
export const getAllBookings = async (req, res) => {
  try {
    const { status, isPriceApproved } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (isPriceApproved !== undefined) filter.isPriceApproved = isPriceApproved === 'true';
    
    const bookings = await AutoFixBooking.find(filter)
      .sort({ createdAt: -1 })
      .populate('userId', 'name email phone')
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

// Get booking by ID (admin view)
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const booking = await AutoFixBooking.findById(id)
      .populate('userId', 'name email phone')
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

// Approve price and send to customer
export const approvePrice = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminApprovedPrice, adminNotes } = req.body;
    
    const booking = await AutoFixBooking.findById(id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    booking.adminApprovedPrice = adminApprovedPrice;
    booking.isPriceApproved = true;
    booking.status = 'price-sent';
    if (adminNotes) booking.adminNotes = adminNotes;
    
    await booking.save();
    
    // Here you would trigger WhatsApp notification
    // For now, we'll just mark it as sent
    booking.whatsappNotificationSent = true;
    await booking.save();
    
    res.json({
      success: true,
      message: 'Price approved and sent to customer',
      data: { booking }
    });
  } catch (error) {
    console.error('Error approving price:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve price'
    });
  }
};

// Assign technician
export const assignTechnician = async (req, res) => {
  try {
    const { id } = req.params;
    const { employeeId } = req.body;
    
    const booking = await AutoFixBooking.findById(id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    const employee = await Employee.findById(employeeId);
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }
    
    booking.assignedTechnician = employeeId;
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

// Update booking status
export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;
    
    const booking = await AutoFixBooking.findById(id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    booking.status = status;
    if (adminNotes) booking.adminNotes = adminNotes;
    
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

// Update admin notes
export const updateAdminNotes = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminNotes } = req.body;
    
    const booking = await AutoFixBooking.findById(id);
    
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

// Get statistics
export const getStats = async (req, res) => {
  try {
    const totalBookings = await AutoFixBooking.countDocuments();
    const pendingReview = await AutoFixBooking.countDocuments({ status: 'pending-review' });
    const priceSent = await AutoFixBooking.countDocuments({ status: 'price-sent' });
    const confirmed = await AutoFixBooking.countDocuments({ status: 'confirmed' });
    const inProgress = await AutoFixBooking.countDocuments({ status: 'in-progress' });
    const completed = await AutoFixBooking.countDocuments({ status: 'completed' });
    
    // Revenue calculation - use adminApprovedPrice if available, otherwise finalPrice
    const revenueResult = await AutoFixBooking.aggregate([
      { $match: { status: 'completed', paymentStatus: 'paid' } },
      { 
        $group: { 
          _id: null, 
          total: { 
            $sum: { 
              $ifNull: ['$adminApprovedPrice', '$pricing.finalPrice'] 
            } 
          } 
        } 
      }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;
    
    // Service type distribution
    const serviceTypeCounts = await AutoFixBooking.aggregate([
      { $group: { _id: '$serviceType', count: { $sum: 1 } } }
    ]);
    
    res.json({
      success: true,
      data: {
        totalBookings,
        pendingReview,
        priceSent,
        confirmed,
        inProgress,
        completed,
        totalRevenue,
        serviceTypeCounts: serviceTypeCounts.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {})
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
};

// Delete booking
export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    
    const booking = await AutoFixBooking.findByIdAndDelete(id);
    
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

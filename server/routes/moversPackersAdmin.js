import express from 'express';
import MoversPackers from '../models/MoversPackers.js';
import { authenticateAdmin } from '../middleware/authAdmin.js';

const router = express.Router();

// Get all bookings (admin only)
router.get('/bookings', authenticateAdmin, async (req, res) => {
  try {
    const { status, page = 1, limit = 20, search } = req.query;
    
    const query = {};
    if (status) {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { contactPhone: { $regex: search, $options: 'i' } },
        { contactEmail: { $regex: search, $options: 'i' } },
        { 'sourceCity.fullAddress': { $regex: search, $options: 'i' } },
        { 'destinationCity.fullAddress': { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    
    const bookings = await MoversPackers.find(query)
      .populate('userId', 'name email phone')
      .populate('assignedEmployee', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await MoversPackers.countDocuments(query);

    res.json({
      success: true,
      data: {
        bookings,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
      error: error.message
    });
  }
});

// Get booking stats
router.get('/stats', authenticateAdmin, async (req, res) => {
  try {
    const stats = await MoversPackers.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$estimatedPrice.totalPrice' }
        }
      }
    ]);

    const totalBookings = await MoversPackers.countDocuments();
    const totalRevenue = await MoversPackers.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$estimatedPrice.totalPrice' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        totalBookings,
        totalRevenue: totalRevenue[0]?.total || 0,
        byStatus: stats
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stats',
      error: error.message
    });
  }
});

// Update booking status
router.patch('/booking/:id/status', authenticateAdmin, async (req, res) => {
  try {
    const { status, adminNotes } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const booking = await MoversPackers.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    booking.status = status;
    if (adminNotes) {
      booking.adminNotes = adminNotes;
    }

    await booking.save();

    res.json({
      success: true,
      message: 'Booking status updated successfully',
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
});

// Assign employee to booking
router.patch('/booking/:id/assign', authenticateAdmin, async (req, res) => {
  try {
    const { employeeId } = req.body;

    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID is required'
      });
    }

    const booking = await MoversPackers.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    booking.assignedEmployee = employeeId;
    await booking.save();

    const updatedBooking = await MoversPackers.findById(req.params.id)
      .populate('assignedEmployee', 'name email');

    res.json({
      success: true,
      message: 'Employee assigned successfully',
      data: updatedBooking
    });
  } catch (error) {
    console.error('Error assigning employee:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to assign employee',
      error: error.message
    });
  }
});

// Delete booking
router.delete('/booking/:id', authenticateAdmin, async (req, res) => {
  try {
    const booking = await MoversPackers.findByIdAndDelete(req.params.id);
    
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
      message: 'Failed to delete booking',
      error: error.message
    });
  }
});

export default router;

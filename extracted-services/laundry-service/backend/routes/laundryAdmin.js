import express from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Employee from '../models/Employee.js';
import { authenticateAdmin } from '../middleware/authAdmin.js';

const router = express.Router();

// Get all laundry bookings (admin only)
router.get('/bookings', authenticateAdmin, async (req, res) => {
  try {
    const { status, page = 1, limit = 20, search } = req.query;
    
    // Base query - find orders with laundry items (match both old and new category formats, and serviceName)
    const query = { 
      $or: [
        { 'items.category': { $regex: 'Laundry', $options: 'i' } },
        { 'items.serviceName': 'washing', 'items.type': 'laundry' }
      ]
    };
    
    // Validate and sanitize status input
    const validStatuses = ['pending', 'confirmed', 'assigned', 'in_progress', 'completed', 'cancelled'];
    if (status && validStatuses.includes(status)) {
      query.orderStatus = status;
    }
    
    // Sanitize search input to prevent injection
    if (search && typeof search === 'string') {
      // Escape special regex characters in search string
      const sanitizedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.$or = [
        { orderNumber: { $regex: sanitizedSearch, $options: 'i' } },
        { 'serviceAddress.phone': { $regex: sanitizedSearch, $options: 'i' } },
        { 'serviceAddress.fullAddress': { $regex: sanitizedSearch, $options: 'i' } }
      ];
    }

    // Validate pagination parameters
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20));
    const skip = (pageNum - 1) * limitNum;
    
    const bookings = await Order.find(query)
      .populate('userId', 'name email phone')
      .populate('assignedEmployee', 'name email phone specialization')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Order.countDocuments(query);

    // Transform bookings to extract laundry-specific information
    const transformedBookings = bookings.map(booking => {
      const laundryItems = booking.items.filter(item => item.category === 'Laundry');
      const laundryDetails = laundryItems.flatMap(item => item.laundryItems || []);
      
      return {
        _id: booking._id,
        orderNumber: booking.orderNumber,
        userId: booking.userId,
        serviceAddress: booking.serviceAddress,
        scheduledDate: booking.scheduledDate,
        scheduledTime: booking.scheduledTime,
        laundryItems: laundryDetails,
        serviceDetails: laundryItems.map(item => ({
          serviceName: item.serviceName,
          packageName: item.packageName,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: booking.totalAmount,
        orderStatus: booking.orderStatus,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        paymentMethod: booking.paymentMethod,
        assignedEmployee: booking.assignedEmployee,
        customerNotes: booking.customerNotes,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt
      };
    });

    res.json({
      success: true,
      data: {
        bookings: transformedBookings,
        pagination: {
          total,
          page: pageNum,
          pages: Math.ceil(total / limitNum)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching laundry bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch laundry bookings',
      error: error.message
    });
  }
});

// Get laundry booking stats
router.get('/stats', authenticateAdmin, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter = { 
      $or: [
        { 'items.category': { $regex: 'Laundry', $options: 'i' } },
        { 'items.serviceName': 'washing', 'items.type': 'laundry' }
      ]
    };
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) {
        const parsedStartDate = new Date(startDate);
        if (isNaN(parsedStartDate.getTime())) {
          return res.status(400).json({
            success: false,
            message: 'Invalid start date format'
          });
        }
        dateFilter.createdAt.$gte = parsedStartDate;
      }
      if (endDate) {
        const parsedEndDate = new Date(endDate);
        if (isNaN(parsedEndDate.getTime())) {
          return res.status(400).json({
            success: false,
            message: 'Invalid end date format'
          });
        }
        dateFilter.createdAt.$lte = parsedEndDate;
      }
    }

    // Get total bookings
    const totalBookings = await Order.countDocuments(dateFilter);

    // Get status counts
    const statusCounts = await Order.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get revenue (only from completed orders)
    const revenueResult = await Order.aggregate([
      { 
        $match: { 
          ...dateFilter,
          $or: [
            { paymentStatus: 'completed' },
            { orderStatus: 'completed' }
          ]
        } 
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' }
        }
      }
    ]);

    // Get laundry item types breakdown
    const itemTypesResult = await Order.aggregate([
      { $match: dateFilter },
      { $unwind: '$items' },
      { $match: { 
        $or: [
          { 'items.category': /Laundry/i },
          { 'items.serviceName': 'washing', 'items.type': 'laundry' }
        ]
      } },
      { $unwind: '$items.laundryItems' },
      {
        $group: {
          _id: '$items.laundryItems.itemType',
          count: { $sum: '$items.laundryItems.quantity' },
          revenue: { $sum: { $multiply: ['$items.laundryItems.quantity', '$items.laundryItems.pricePerItem'] } }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const statusObj = {};
    statusCounts.forEach(stat => {
      statusObj[stat._id] = stat.count;
    });

    res.json({
      success: true,
      data: {
        totalBookings,
        totalRevenue: revenueResult[0]?.total || 0,
        statusCounts: statusObj,
        itemTypes: itemTypesResult.map(item => ({
          type: item._id,
          count: item.count,
          revenue: item.revenue
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching laundry stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch laundry statistics',
      error: error.message
    });
  }
});

// Get specific booking by ID
router.get('/booking/:id', authenticateAdmin, async (req, res) => {
  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID format'
      });
    }

    const booking = await Order.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate('assignedEmployee', 'name email phone specialization');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if this order has laundry items
    const hasLaundry = booking.items.some(item => item.category === 'Laundry');
    if (!hasLaundry) {
      return res.status(400).json({
        success: false,
        message: 'This order does not contain laundry services'
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
});

// Assign employee to laundry booking
router.patch('/booking/:id/assign', authenticateAdmin, async (req, res) => {
  try {
    const { employeeId } = req.body;

    // Validate booking ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID format'
      });
    }

    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID is required'
      });
    }

    // Validate employee ID
    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid employee ID format'
      });
    }

    // Verify employee exists and is active
    const employee = await Employee.findById(employeeId);
    if (!employee || !employee.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or inactive employee'
      });
    }

    const booking = await Order.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    booking.assignedEmployee = employeeId;
    booking.orderStatus = 'assigned';
    booking.status = 'assigned';
    await booking.save();

    // Update employee stats
    await Employee.findByIdAndUpdate(employeeId, {
      $inc: { 'stats.totalAssignments': 1 }
    });

    const updatedBooking = await Order.findById(req.params.id)
      .populate('assignedEmployee', 'name email phone specialization');

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

// Update booking status
router.patch('/booking/:id/status', authenticateAdmin, async (req, res) => {
  try {
    const { status, adminNotes } = req.body;

    // Validate booking ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID format'
      });
    }

    const validStatuses = ['pending', 'confirmed', 'assigned', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const booking = await Order.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    booking.orderStatus = status;
    booking.status = status;
    if (adminNotes) booking.customerNotes = adminNotes;

    // Set completion time if marking as completed
    if (status === 'completed' && !booking.actualEndTime) {
      booking.actualEndTime = new Date();
    }

    await booking.save();

    const updatedBooking = await Order.findById(req.params.id)
      .populate('assignedEmployee', 'name email phone specialization');

    res.json({
      success: true,
      message: 'Status updated successfully',
      data: updatedBooking
    });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update status',
      error: error.message
    });
  }
});

// Update admin notes
router.patch('/booking/:id/notes', authenticateAdmin, async (req, res) => {
  try {
    const { adminNotes } = req.body;

    // Validate booking ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID format'
      });
    }

    const booking = await Order.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    booking.customerNotes = adminNotes;
    await booking.save();

    res.json({
      success: true,
      message: 'Notes updated successfully',
      data: booking
    });
  } catch (error) {
    console.error('Error updating notes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update notes',
      error: error.message
    });
  }
});

export default router;

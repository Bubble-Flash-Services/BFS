import GreenBooking from '../models/GreenBooking.js';
import Provider from '../models/Provider.js';
import Branch from '../models/Branch.js';
import { manualAssignProvider } from '../services/assignmentService.js';

/**
 * Get all green bookings (Admin)
 * GET /api/green/admin/bookings?status=&from=&to=
 */
export const getAllGreenBookings = async (req, res) => {
  try {
    const { status, from, to, page = 1, limit = 50 } = req.query;

    const query = {};
    
    if (status) {
      query.status = status;
    }

    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) query.createdAt.$lte = new Date(to);
    }

    const skip = (page - 1) * limit;

    const [bookings, total] = await Promise.all([
      GreenBooking.find(query)
        .populate('serviceId')
        .populate('branchId')
        .populate('providerId')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      GreenBooking.countDocuments(query)
    ]);

    res.json({
      success: true,
      bookings, // Return bookings at top level to match frontend expectation
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching green bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
      error: error.message
    });
  }
};

/**
 * Manual assignment of provider to booking
 * POST /api/green/admin/assign
 */
export const assignProviderToBooking = async (req, res) => {
  try {
    const { bookingId, providerId } = req.body;

    if (!bookingId || !providerId) {
      return res.status(400).json({
        success: false,
        message: 'Booking ID and Provider ID are required'
      });
    }

    const booking = await GreenBooking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    const result = await manualAssignProvider(bookingId, providerId);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error
      });
    }

    // Update booking
    booking.providerId = providerId;
    booking.status = 'assigned';
    await booking.save();

    // Update provider
    const provider = result.provider;
    provider.totalBookings += 1;
    await provider.save();

    res.json({
      success: true,
      message: 'Provider assigned successfully',
      data: {
        booking,
        provider
      }
    });
  } catch (error) {
    console.error('Error assigning provider:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to assign provider',
      error: error.message
    });
  }
};

/**
 * Get dashboard statistics
 * GET /api/green/admin/stats
 */
export const getGreenStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalBookings,
      todayBookings,
      pendingBookings,
      completedBookings,
      totalRevenue,
      activeProviders
    ] = await Promise.all([
      GreenBooking.countDocuments(),
      GreenBooking.countDocuments({ createdAt: { $gte: today } }),
      GreenBooking.countDocuments({ status: { $in: ['created', 'assigned'] } }),
      GreenBooking.countDocuments({ status: 'completed' }),
      GreenBooking.aggregate([
        { $match: { 'payment.status': 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      Provider.countDocuments({ available: true, isActive: true })
    ]);

    res.json({
      success: true,
      data: {
        totalBookings,
        todayBookings,
        pendingBookings,
        completedBookings,
        totalRevenue: totalRevenue[0]?.total || 0,
        activeProviders
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
};

/**
 * Get all branches
 * GET /api/green/admin/branches
 */
export const getAllBranches = async (req, res) => {
  try {
    const branches = await Branch.find().sort({ name: 1 });

    res.json({
      success: true,
      data: branches
    });
  } catch (error) {
    console.error('Error fetching branches:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch branches',
      error: error.message
    });
  }
};

/**
 * Create new branch (Admin)
 * POST /api/green/admin/branches
 */
export const createBranch = async (req, res) => {
  try {
    const branchData = req.body;

    const branch = new Branch(branchData);
    await branch.save();

    res.status(201).json({
      success: true,
      message: 'Branch created successfully',
      data: branch
    });
  } catch (error) {
    console.error('Error creating branch:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create branch',
      error: error.message
    });
  }
};

/**
 * Update branch (Admin)
 * PUT /api/green/admin/branches/:id
 */
export const updateBranch = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const branch = await Branch.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: 'Branch not found'
      });
    }

    res.json({
      success: true,
      message: 'Branch updated successfully',
      data: branch
    });
  } catch (error) {
    console.error('Error updating branch:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update branch',
      error: error.message
    });
  }
};

/**
 * Update booking status (Admin)
 * PATCH /api/green/admin/bookings/:id/status
 */
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    // Validate status
    const validStatuses = ['created', 'assigned', 'in_progress', 'completed', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: created, assigned, in_progress, completed, cancelled'
      });
    }

    const booking = await GreenBooking.findById(id);
    
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

    // Set completion or cancellation time
    if (status === 'completed' && !booking.completedAt) {
      booking.completedAt = new Date();
    } else if (status === 'cancelled' && !booking.cancelledAt) {
      booking.cancelledAt = new Date();
    }

    await booking.save();

    res.json({
      success: true,
      message: 'Booking status updated successfully',
      data: booking
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update booking status',
      error: error.message
    });
  }
};

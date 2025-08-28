import express from 'express';
import Admin from '../models/Admin.js';
import Employee from '../models/Employee.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import Coupon from '../models/Coupon.js';
import { authenticateAdmin, requirePermission } from '../middleware/authAdmin.js';

const router = express.Router();

// ==================== DASHBOARD ROUTES ====================

// Get dashboard stats
router.get('/dashboard/stats', authenticateAdmin, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get stats in parallel for better performance
    const [
      totalUsers,
      totalEmployees,
      totalBookings,
      todayBookings,
      revenueResult,
      pendingBookings,
      completedBookings,
      cancelledBookings
    ] = await Promise.all([
      User.countDocuments({ isActive: true }),
      Employee.countDocuments({ isActive: true }),
      Order.countDocuments(),
      Order.countDocuments({ createdAt: { $gte: today, $lt: tomorrow } }),
      Order.aggregate([
        { $match: { status: { $in: ['completed', 'paid'] } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      Order.countDocuments({ status: 'pending' }),
      Order.countDocuments({ status: 'completed' }),
      Order.countDocuments({ status: 'cancelled' })
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Get monthly revenue data for chart
    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          status: { $in: ['completed', 'paid'] },
          createdAt: { $gte: new Date(new Date().getFullYear(), 0, 1) }
        }
      },
      {
        $group: {
          _id: { month: { $month: '$createdAt' } },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { '_id.month': 1 } }
    ]);

    // Get recent bookings
    const recentBookings = await Order.find()
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('_id serviceType status totalAmount createdAt');

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalEmployees,
          totalBookings,
          todayBookings,
          totalRevenue,
          pendingBookings,
          completedBookings,
          cancelledBookings
        },
        monthlyRevenue: monthlyRevenue.map(item => ({
          month: item._id.month,
          revenue: item.revenue,
          orders: item.orders
        })),
        recentBookings
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats'
    });
  }
});

// ==================== USER MANAGEMENT ROUTES ====================

// Get all users with pagination and filters
router.get('/users', authenticateAdmin, requirePermission('users'), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const status = req.query.status || 'all';

    let filter = {};
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    if (status !== 'all') {
      filter.status = status;
    }

    const skip = (page - 1) * limit;

    const [users, totalUsers] = await Promise.all([
      User.find(filter)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(filter)
    ]);

    // Get user stats
    const userStats = await User.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          activeUsers: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
          inactiveUsers: { $sum: { $cond: [{ $eq: ['$status', 'inactive'] }, 1, 0] } },
          suspendedUsers: { $sum: { $cond: [{ $eq: ['$status', 'suspended'] }, 1, 0] } },
          googleUsers: { $sum: { $cond: [{ $eq: ['$provider', 'google'] }, 1, 0] } },
          localUsers: { $sum: { $cond: [{ $eq: ['$provider', 'local'] }, 1, 0] } }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total: totalUsers,
          pages: Math.ceil(totalUsers / limit)
        },
        stats: userStats[0] || {
          totalUsers: 0,
          activeUsers: 0,
          inactiveUsers: 0,
          suspendedUsers: 0,
          googleUsers: 0,
          localUsers: 0
        }
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
});

// Update user status
router.patch('/users/:userId/status', authenticateAdmin, requirePermission('users'), async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    // Validate status
    if (!['active', 'inactive', 'suspended'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be active, inactive, or suspended'
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { status },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: `User status updated to ${status} successfully`,
      user
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user status'
    });
  }
});

// Update user status (PUT method for frontend compatibility)
router.put('/users/:userId/status', authenticateAdmin, requirePermission('users'), async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    // Validate status
    if (!['active', 'inactive', 'suspended'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be active, inactive, or suspended'
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { status },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: `User status updated to ${status} successfully`,
      user
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user status'
    });
  }
});

// Delete user
router.delete('/users/:userId', authenticateAdmin, requirePermission('users'), async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user has any orders (optional - you may want to keep this check)
    const userOrders = await Order.countDocuments({ userId });
    
    if (userOrders > 0) {
      // Instead of deleting, mark as inactive
      const user = await User.findByIdAndUpdate(
        userId,
        { status: 'inactive' },
        { new: true }
      ).select('-password');

      return res.json({
        success: true,
        message: 'User deactivated (has existing orders)',
        user,
        deactivated: true
      });
    }

    // If no orders, actually delete the user
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully',
      deleted: true
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user'
    });
  }
});

// ==================== EMPLOYEE MANAGEMENT ROUTES ====================

// Get all employees
router.get('/employees', authenticateAdmin, requirePermission('employees'), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const specialization = req.query.specialization || 'all';
    const status = req.query.status || 'all';

    let filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } }
      ];
    }

    if (specialization !== 'all') {
      filter.specialization = specialization;
    }

    if (status !== 'all') {
      filter.isActive = status === 'active';
    }

    const skip = (page - 1) * limit;

    const [employees, totalEmployees] = await Promise.all([
      Employee.find(filter)
        .select('-password')
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Employee.countDocuments(filter)
    ]);

    // Get employee stats
    const employeeStats = await Employee.aggregate([
      {
        $group: {
          _id: null,
          totalEmployees: { $sum: 1 },
          activeEmployees: { $sum: { $cond: ['$isActive', 1, 0] } },
          carSpecialists: { $sum: { $cond: [{ $eq: ['$specialization', 'car'] }, 1, 0] } },
          bikeSpecialists: { $sum: { $cond: [{ $eq: ['$specialization', 'bike'] }, 1, 0] } },
          laundrySpecialists: { $sum: { $cond: [{ $eq: ['$specialization', 'laundry'] }, 1, 0] } },
          avgRating: { $avg: '$stats.averageRating' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        employees,
        pagination: {
          page,
          limit,
          total: totalEmployees,
          pages: Math.ceil(totalEmployees / limit)
        },
        stats: employeeStats[0] || {
          totalEmployees: 0,
          activeEmployees: 0,
          carSpecialists: 0,
          bikeSpecialists: 0,
          laundrySpecialists: 0,
          avgRating: 0
        }
      }
    });
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employees'
    });
  }
});

// Create new employee
router.post('/employees', authenticateAdmin, requirePermission('employees'), async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      address,
      specialization,
      salary,
      commissionRate,
      emergencyContact,
      bankDetails
    } = req.body;

    // Check if employee already exists
    const existingEmployee = await Employee.findOne({
      $or: [{ email }, { phone }]
    });

    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        message: 'Employee with this email or phone already exists'
      });
    }

    const employee = new Employee({
      name,
      email: email.toLowerCase(),
      phone,
      password,
      address,
      specialization,
      salary: salary || 0,
      commissionRate: commissionRate || 15,
      emergencyContact,
      bankDetails,
      createdBy: req.admin._id
    });

    await employee.save();

    // Return employee without password
    const newEmployee = await Employee.findById(employee._id)
      .select('-password')
      .populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      employee: newEmployee
    });
  } catch (error) {
    console.error('Create employee error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create employee'
    });
  }
});

// Update employee
router.put('/employees/:employeeId', authenticateAdmin, requirePermission('employees'), async (req, res) => {
  try {
    const { employeeId } = req.params;
    const updateData = { ...req.body };
    
    // Remove password from update data if it's empty
    if (updateData.password && updateData.password.trim() === '') {
      delete updateData.password;
    }

    const employee = await Employee.findByIdAndUpdate(
      employeeId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password').populate('createdBy', 'name email');

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.json({
      success: true,
      message: 'Employee updated successfully',
      employee
    });
  } catch (error) {
    console.error('Update employee error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update employee'
    });
  }
});

// Delete employee
router.delete('/employees/:employeeId', authenticateAdmin, requirePermission('employees'), async (req, res) => {
  try {
    const { employeeId } = req.params;

    const employee = await Employee.findByIdAndDelete(employeeId);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.json({
      success: true,
      message: 'Employee deleted successfully'
    });
  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete employee'
    });
  }
});

// Update employee status
router.patch('/employees/:employeeId/status', authenticateAdmin, requirePermission('employees'), async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { isActive } = req.body;

    const employee = await Employee.findByIdAndUpdate(
      employeeId,
      { isActive },
      { new: true }
    ).select('-password');

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.json({
      success: true,
      message: `Employee ${isActive ? 'activated' : 'deactivated'} successfully`,
      employee
    });
  } catch (error) {
    console.error('Update employee status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update employee status'
    });
  }
});

// ==================== BOOKING MANAGEMENT ROUTES ====================

// Get all bookings with filters
router.get('/bookings', authenticateAdmin, requirePermission('bookings'), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const status = req.query.status || 'all';
    const serviceType = req.query.serviceType || 'all';
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    let filter = {};

    if (search) {
      // Search in populated user fields will be handled by aggregation
      filter['userId.name'] = { $regex: search, $options: 'i' };
    }

    if (status !== 'all') {
      filter.status = status;
    }

    if (serviceType !== 'all') {
      filter.serviceType = { $regex: serviceType, $options: 'i' };
    }

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const skip = (page - 1) * limit;

    const [bookings, totalBookings] = await Promise.all([
      Order.find()
        .populate('userId', 'name email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments()
    ]);

    // Filter bookings based on search if provided
    let filteredBookings = bookings;
    if (search) {
      filteredBookings = bookings.filter(booking =>
        booking.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
        booking.userId?.email?.toLowerCase().includes(search.toLowerCase()) ||
        booking.serviceType?.toLowerCase().includes(search.toLowerCase())
      );
    }

    res.json({
      success: true,
      data: {
        bookings: filteredBookings,
        pagination: {
          page,
          limit,
          total: totalBookings,
          pages: Math.ceil(totalBookings / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings'
    });
  }
});

// Get unassigned bookings
router.get('/bookings/unassigned', authenticateAdmin, requirePermission('bookings'), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Find orders that don't have an assigned employee or have status 'pending' or 'confirmed'
    const filter = {
      $and: [
        {
          $or: [
            { assignedEmployee: { $exists: false } },
            { assignedEmployee: null }
          ]
        },
        {
          orderStatus: { $in: ['pending', 'confirmed'] }
        }
      ]
    };

    const [unassignedBookings, totalUnassigned] = await Promise.all([
      Order.find(filter)
        .populate('userId', 'name email phone')
        .populate('items.serviceId', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: {
        bookings: unassignedBookings,
        pagination: {
          page,
          limit,
          total: totalUnassigned,
          pages: Math.ceil(totalUnassigned / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get unassigned bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch unassigned bookings'
    });
  }
});

// Assign employee to booking
router.patch('/bookings/:bookingId/assign', authenticateAdmin, requirePermission('bookings'), async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { employeeId } = req.body;

    // Verify employee exists and is active
    const employee = await Employee.findById(employeeId);
    if (!employee || !employee.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or inactive employee'
      });
    }

    const booking = await Order.findByIdAndUpdate(
      bookingId,
      { 
        assignedEmployee: employeeId,
        status: 'assigned'
      },
      { new: true }
    ).populate('userId', 'name email phone')
     .populate('assignedEmployee', 'name employeeId specialization');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Update employee stats
    await Employee.findByIdAndUpdate(employeeId, {
      $inc: { 'stats.totalAssignments': 1 }
    });

    res.json({
      success: true,
      message: 'Employee assigned successfully',
      booking
    });
  } catch (error) {
    console.error('Assign employee error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to assign employee'
    });
  }
});

// ==================== COUPON MANAGEMENT ROUTES ====================

// Get all coupons
router.get('/coupons', authenticateAdmin, requirePermission('coupons'), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const status = req.query.status || 'all';
    const type = req.query.type || 'all';

    let filter = {};

    if (search) {
      filter.$or = [
        { code: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (status !== 'all') {
      const now = new Date();
      if (status === 'active') {
        filter.isActive = true;
        filter.validUntil = { $gte: now };
      } else if (status === 'expired') {
        filter.validUntil = { $lt: now };
      } else if (status === 'inactive') {
        filter.isActive = false;
      }
    }

    if (type !== 'all') {
      filter.couponType = type;
    }

    const skip = (page - 1) * limit;

    const [coupons, totalCoupons] = await Promise.all([
      Coupon.find(filter)
        .populate('applicableCategories', 'name')
        .populate('applicableServices', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Coupon.countDocuments(filter)
    ]);

    // Add computed fields for better frontend display
    const enhancedCoupons = coupons.map(coupon => ({
      ...coupon.toObject(),
      typeLabel: getCouponTypeLabel(coupon.couponType),
      isExpired: new Date() > coupon.validUntil,
      isValid: coupon.isValid(),
      usage: coupon.usageLimit ? `${coupon.usedCount}/${coupon.usageLimit}` : `${coupon.usedCount}/∞`
    }));

    res.json({
      success: true,
      data: {
        coupons: enhancedCoupons,
        pagination: {
          page,
          limit,
          total: totalCoupons,
          pages: Math.ceil(totalCoupons / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get coupons error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch coupons'
    });
  }
});

// Helper function for coupon type labels
const getCouponTypeLabel = (type) => {
  const labels = {
    'welcome': 'Welcome Offer',
    'festival_seasonal': 'Festival Special',
    'referral': 'Referral Bonus',
    'loyalty': 'Loyalty Reward',
    'minimum_order': 'Minimum Order Discount',
    'limited_time': 'Flash Sale',
    'service_specific': 'Service Special'
  };
  return labels[type] || 'Special Offer';
};

// Create new coupon
router.post('/coupons', authenticateAdmin, requirePermission('coupons'), async (req, res) => {
  try {
    const couponData = {
      ...req.body,
      createdBy: req.admin._id
    };

    const coupon = new Coupon(couponData);
    await coupon.save();

    res.status(201).json({
      success: true,
      message: 'Coupon created successfully',
      coupon
    });
  } catch (error) {
    console.error('Create coupon error:', error);
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        message: 'Coupon code already exists'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to create coupon'
      });
    }
  }
});

// Update coupon
router.put('/coupons/:couponId', authenticateAdmin, requirePermission('coupons'), async (req, res) => {
  try {
    const { couponId } = req.params;

    const coupon = await Coupon.findByIdAndUpdate(
      couponId,
      req.body,
      { new: true, runValidators: true }
    );

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    res.json({
      success: true,
      message: 'Coupon updated successfully',
      coupon
    });
  } catch (error) {
    console.error('Update coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update coupon'
    });
  }
});

// Delete coupon
router.delete('/coupons/:couponId', authenticateAdmin, requirePermission('coupons'), async (req, res) => {
  try {
    const { couponId } = req.params;

    const coupon = await Coupon.findByIdAndDelete(couponId);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    res.json({
      success: true,
      message: 'Coupon deleted successfully'
    });
  } catch (error) {
    console.error('Delete coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete coupon'
    });
  }
});

export default router;

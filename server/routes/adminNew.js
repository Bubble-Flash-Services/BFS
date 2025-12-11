import express from 'express';
import Admin from '../models/Admin.js';
import Employee from '../models/Employee.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Address from '../models/Address.js';
import Coupon from '../models/Coupon.js';
import PaintingQuote from '../models/PaintingQuote.js';
import MoversPackers from '../models/MoversPackers.js';
import VehicleCheckupBooking from '../models/VehicleCheckupBooking.js';
import KeyServiceBooking from '../models/KeyServiceBooking.js';
import GreenBooking from '../models/GreenBooking.js';
import { authenticateAdmin, requirePermission } from '../middleware/authAdmin.js';
import { searchByFolder } from '../services/cloudinary.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// ==================== DASHBOARD ROUTES ====================

// Get dashboard stats
router.get('/dashboard/stats', authenticateAdmin, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Match conditions shared across computations
    const revenueMatch = {
      $or: [
        { paymentStatus: 'completed' },
        { orderStatus: 'completed' },
        { status: 'completed' }
      ]
    };
    const cancelledMatch = { $or: [ { orderStatus: 'cancelled' }, { status: 'cancelled' } ] };
    const completedMatch = { $or: [ { orderStatus: 'completed' }, { status: 'completed' } ] };
    const pendingMatch = { $or: [ { orderStatus: 'pending' }, { status: { $in: ['assigned', 'in-progress'] } } ] };

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
      // Today bookings should use scheduledDate, not createdAt
      Order.countDocuments({ scheduledDate: { $gte: today, $lt: tomorrow } }),
      // Revenue from completed orders/payments
      Order.aggregate([
        { $match: revenueMatch },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      // Pending/Completed/Cancelled across either field name
      Order.countDocuments(pendingMatch),
      Order.countDocuments(completedMatch),
      Order.countDocuments(cancelledMatch)
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Get monthly revenue data for chart
    const startOfYear = new Date(new Date().getFullYear(), 0, 1);
    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfYear },
          $or: [
            { paymentStatus: 'completed' },
            { orderStatus: 'completed' },
            { status: 'completed' }
          ]
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

    // Get recent bookings with fields needed for admin dashboard table
    const recentBookings = await Order.find()
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('_id serviceType status totalAmount paymentMethod serviceAddress items createdAt customerNotes paymentDetails');

    // Get service-specific order counts
    const [
      carWashOrders,
      bikeWashOrders,
      helmetWashOrders,
      greenCleanCartOrders,
      greenCleanDirectBookings,
      moversPackersOrders,
      paintingOrders,
      laundryOrders,
      vehicleCheckupCartOrders,
      vehicleCheckupDirectBookings,
      insuranceOrders,
      pucOrders,
      keyServicesCartOrders,
      keyServicesDirectBookings,
      vehicleAccessoriesOrders
    ] = await Promise.all([
      Order.countDocuments({ 'items.category': 'Car Wash' }),
      Order.countDocuments({ 'items.category': 'Bike Wash' }),
      Order.countDocuments({ 'items.category': 'Helmet Wash' }),
      Order.countDocuments({ 'items.category': 'Green & Clean' }),
      GreenBooking.countDocuments(),
      MoversPackers.countDocuments(),
      PaintingQuote.countDocuments(),
      Order.countDocuments({ 'items.category': 'Laundry' }),
      // Count vehicle checkup from Orders like PUC and Insurance
      Order.countDocuments({ 'items.category': 'Vehicle Checkup' }),
      // Also count from VehicleCheckupBooking model (legacy direct bookings)
      VehicleCheckupBooking.countDocuments(),
      Order.countDocuments({ 'items.category': 'Insurance' }),
      Order.countDocuments({ 'items.category': 'PUC Certificate' }),
      Order.countDocuments({ 'items.type': 'key-services' }),
      KeyServiceBooking.countDocuments(),
      // Regex match for accessories - matches 'car Accessories', 'bike Accessories', 'common Accessories'
      // Note: If performance becomes an issue, create index on items.category or use exact matches
      Order.countDocuments({ 'items.category': { $regex: 'Accessories', $options: 'i' } })
    ]);

    // Total key services, green clean, and vehicle checkup include both cart orders and direct bookings
    const keyServicesOrders = keyServicesCartOrders + keyServicesDirectBookings;
    const greenCleanOrders = greenCleanCartOrders + greenCleanDirectBookings;
    const vehicleCheckupOrders = vehicleCheckupCartOrders + vehicleCheckupDirectBookings;

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
        serviceBreakdown: {
          carWash: carWashOrders,
          bikeWash: bikeWashOrders,
          helmetWash: helmetWashOrders,
          greenClean: greenCleanOrders,
          moversPackers: moversPackersOrders,
          painting: paintingOrders,
          laundry: laundryOrders,
          vehicleCheckup: vehicleCheckupOrders,
          insurance: insuranceOrders,
          puc: pucOrders,
          keyServices: keyServicesOrders,
          vehicleAccessories: vehicleAccessoriesOrders
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

    // Ensure user exists first
    const user = await User.findById(userId).select('_id');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Cascade delete: Orders, Cart, Addresses, and finally the User document
    await Promise.all([
      Order.deleteMany({ userId }),
      Cart.deleteOne({ userId }),
      Address.deleteMany({ userId })
    ]);

    await User.findByIdAndDelete(userId);

    res.json({
      success: true,
      message: 'User and all related data deleted successfully',
      deleted: true
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete user' });
  }
});

// Get the latest order of a user (for checkout phone/address)
router.get('/users/:userId/last-order', authenticateAdmin, requirePermission('users'), async (req, res) => {
  try {
    const { userId } = req.params;
    const order = await Order.findOne({ userId })
      .sort({ createdAt: -1 })
      .select('serviceAddress customerNotes paymentDetails paymentMethod createdAt');

    if (!order) {
      return res.json({ success: true, data: null, message: 'No orders for user' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    console.error('Get last order error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch last order' });
  }
});

// Admin: generate impersonation token for a user (login as that user)
router.post('/users/:userId/impersonate', authenticateAdmin, requirePermission('users'), async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const token = jwt.sign({ id: user._id, impersonatedBy: req.admin?._id || 'admin' }, process.env.JWT_SECRET || 'secret', { expiresIn: '15m' });
    res.json({ success: true, token, user: { _id: user._id, name: user.name, email: user.email, phone: user.phone } });
  } catch (error) {
    console.error('Impersonation token error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate impersonation token' });
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

// Get employee details: attendance, completed tasks (with images), reviews
router.get('/employees/:employeeId/details', authenticateAdmin, requirePermission('employees'), async (req, res) => {
  try {
    const { employeeId } = req.params;
    const employee = await Employee.findById(employeeId).select('-password');
    if (!employee) return res.status(404).json({ success: false, message: 'Employee not found' });

    // Attendance images from Cloudinary (last 30)
    const slug = (employee.name || 'employee').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
    const attendanceFolder = `bfs/attendance/${slug}`;
    let attendance = [];
    try {
      const att = await searchByFolder({ folder: attendanceFolder, maxResults: 60 });
      attendance = (att.resources || []).map(r => ({ url: r.secure_url, publicId: r.public_id, uploadedAt: r.created_at }));
    } catch (e) {
      attendance = [];
    }

    // Completed orders assigned to this employee with images and reviews
    const completedOrders = await Order.find({ assignedEmployee: employee._id, $or: [ { orderStatus: 'completed' }, { status: 'completed' } ] })
      .select('orderNumber userId totalAmount completedAt workImages rating review serviceAddress items')
      .populate('userId', 'name phone');

    const tasks = completedOrders.map(o => ({
      orderNumber: o.orderNumber,
      amount: o.totalAmount,
      completedAt: o.completedAt,
      beforeImage: o.workImages?.before?.url || null,
      afterImage: o.workImages?.after?.url || null,
      customer: { name: o.userId?.name || '', phone: o.userId?.phone || '' },
      rating: o.rating || null,
      review: o.review || '',
      address: o.serviceAddress?.fullAddress || '',
  items: (o.items || []).map(it => ({ name: it.serviceName, qty: it.quantity, price: it.price, image: it.image || null }))
    }));

    res.json({ success: true, data: { employee, attendance, tasks } });
  } catch (error) {
    console.error('Get employee details error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch employee details' });
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

// Cancel a booking (admin)
router.put('/bookings/:bookingId/cancel', authenticateAdmin, requirePermission('bookings'), async (req, res) => {
  try {
    const { bookingId } = req.params;
    const reason = req.body?.reason || 'your order is cancalled by the the management';

    // Accept either Mongo ObjectId or BFS orderNumber
    let order = null;
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(bookingId);
    if (isObjectId) {
      order = await Order.findById(bookingId);
    } else {
      order = await Order.findOne({ orderNumber: bookingId });
    }
    if (!order) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (order.orderStatus === 'completed') {
      return res.status(400).json({ success: false, message: 'Completed orders cannot be cancelled' });
    }

    order.orderStatus = 'cancelled';
    order.customerNotes = reason;
    await order.save();

    res.json({ success: true, message: 'Booking cancelled successfully', booking: order });
  } catch (error) {
    console.error('Admin cancel booking error:', error);
    res.status(500).json({ success: false, message: 'Failed to cancel booking' });
  }
});

// Update booking status (admin) - completed | pending | cancelled
router.put('/bookings/:bookingId/status', authenticateAdmin, requirePermission('bookings'), async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body || {};
    const allowed = ['completed', 'pending', 'cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status. Use completed, pending, or cancelled.' });
    }

    // Find by ObjectId or orderNumber
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(bookingId);
    const order = isObjectId ? await Order.findById(bookingId) : await Order.findOne({ orderNumber: bookingId });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Prevent illegal transitions if needed (optional). For now allow any of the three.
    order.orderStatus = status;
    // Keep legacy `status` in sync for employee views
    if (status === 'completed') order.status = 'completed';
    if (status === 'cancelled') order.status = 'cancelled';

    // If marking completed, recompute totals from items and mark payment done (COD/Wallet/UPI/etc.)
    if (status === 'completed') {
      if (order.paymentStatus !== 'completed') {
        const subtotal = (order.items || []).reduce((sum, it) => {
          const base = (it.price || 0) * (it.quantity || 1);
          const addOns = (it.addOns || []).reduce((s, a) => s + (a.price || 0) * (a.quantity || 1), 0);
          const laundry = (it.laundryItems || []).reduce((s, l) => s + (l.pricePerItem || 0) * (l.quantity || 1), 0);
          return sum + base + addOns + laundry;
        }, 0);
        order.subtotal = subtotal;
        const discount = order.discountAmount || 0;
        order.totalAmount = Math.max(0, subtotal - discount);
        // Consider completion as payment collected for non-gateway flows
        const markPaidMethods = new Set(['cash', 'gpay', 'phonepe', 'paytm', 'upi', 'wallet']);
        if (markPaidMethods.has((order.paymentMethod || '').toLowerCase())) {
          order.paymentStatus = 'completed';
          order.paidAt = new Date();
        }
      }
      // Always record finish time
      order.actualEndTime = new Date();
    }
    if (status === 'cancelled' && !order.customerNotes) {
      order.customerNotes = 'your order is cancalled by the the management';
    }
  await order.save();

  res.json({ success: true, message: 'Booking status updated', booking: order });
  } catch (error) {
    console.error('Admin update booking status error:', error);
    res.status(500).json({ success: false, message: 'Failed to update booking status' });
  }
});

// Update booking payment status (admin) - pending | processing | completed | failed | refunded
router.put('/bookings/:bookingId/payment', authenticateAdmin, requirePermission('bookings'), async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { paymentStatus } = req.body || {};
    const allowed = ['pending', 'processing', 'completed', 'failed', 'refunded'];
    if (!allowed.includes((paymentStatus || '').toLowerCase())) {
      return res.status(400).json({ success: false, message: 'Invalid payment status. Use pending, processing, completed, failed, or refunded.' });
    }

    // Find by ObjectId or orderNumber
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(bookingId);
    const order = isObjectId ? await Order.findById(bookingId) : await Order.findOne({ orderNumber: bookingId });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const newStatus = paymentStatus.toLowerCase();
    order.paymentStatus = newStatus;
    if (newStatus === 'completed') {
      order.paidAt = new Date();
      // If order not yet confirmed, confirm it on successful payment
      if (!order.orderStatus || order.orderStatus === 'pending') {
        order.orderStatus = 'confirmed';
        if (!order.status || order.status === 'assigned') order.status = 'assigned';
      }
    } else {
      // Clear paidAt for non-completed states to avoid confusion
      order.paidAt = undefined;
    }

    await order.save();

    res.json({ success: true, message: 'Payment status updated', booking: order });
  } catch (error) {
    console.error('Admin update payment status error:', error);
    res.status(500).json({ success: false, message: 'Failed to update payment status' });
  }
});

// Delete a booking (admin)
router.delete('/bookings/:bookingId', authenticateAdmin, requirePermission('bookings'), async (req, res) => {
  try {
    const { bookingId } = req.params;
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(bookingId);
    const order = isObjectId ? await Order.findById(bookingId) : await Order.findOne({ orderNumber: bookingId });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    await order.deleteOne();
    res.json({ success: true, message: 'Booking deleted successfully', orderNumber: order.orderNumber });
  } catch (error) {
    console.error('Admin delete booking error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete booking' });
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
        .populate('items.serviceId', 'name image')
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
    status: 'assigned',
    orderStatus: 'assigned'
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

import express from 'express';
import jwt from 'jsonwebtoken';
import Employee from '../models/Employee.js';
import Order from '../models/Order.js';
import { authenticateEmployee } from '../middleware/authAdmin.js';
import multer from 'multer';
import { uploadImage, getResourceByPublicId } from '../services/cloudinary.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// =============== AUTH: MOBILE NUMBER ONLY (NO OTP) =================
router.post('/auth/login-mobile', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ success: false, message: 'Phone is required' });

    const employee = await Employee.findOne({ phone });
    if (!employee || !employee.isActive) {
      return res.status(401).json({ success: false, message: 'Invalid phone or inactive account' });
    }

    const token = jwt.sign({ id: employee._id, type: 'employee' }, process.env.JWT_SECRET, { expiresIn: '7d' });
    await Employee.findByIdAndUpdate(employee._id, { lastLogin: new Date() });
    res.json({ success: true, token, employee: { id: employee._id, name: employee.name, phone: employee.phone } });
  } catch (err) {
    console.error('Employee login-mobile error:', err);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
});

// ==================== EMPLOYEE DASHBOARD ROUTES ====================

// Get employee dashboard data
router.get('/dashboard', authenticateEmployee, async (req, res) => {
  try {
    const employeeId = req.employee._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get today's assignments (for stats)
  const todayAssignments = await Order.find({
      assignedEmployee: employeeId,
      scheduledDate: { $gte: today, $lt: tomorrow }
    }).populate('userId', 'name phone');

    // Get active assignments to display (regardless of date)
    const activeAssignments = await Order.find({
      assignedEmployee: employeeId,
      status: { $in: ['assigned', 'in-progress'] }
    })
      .populate('userId', 'name phone')
      .sort({ scheduledDate: 1, scheduledTimeSlot: 1 })
      .limit(50);

    // Get employee stats
    const [
      totalAssignments,
      completedTasks,
      pendingTasks,
      todayEarnings
    ] = await Promise.all([
      Order.countDocuments({ assignedEmployee: employeeId }),
      Order.countDocuments({ 
        assignedEmployee: employeeId, 
        status: 'completed' 
      }),
      Order.countDocuments({ 
        assignedEmployee: employeeId, 
        status: { $in: ['assigned', 'in-progress'] } 
      }),
      Order.aggregate([
        {
          $match: {
            assignedEmployee: employeeId,
            status: 'completed',
            completedAt: { $gte: today, $lt: tomorrow }
          }
        },
        {
          $group: {
            _id: null,
            totalEarnings: { $sum: { $multiply: ['$totalAmount', req.employee.commissionRate / 100] } }
          }
        }
      ])
    ]);

    const earnings = todayEarnings[0]?.totalEarnings || 0;

    res.json({
      success: true,
      data: {
        employee: {
          id: req.employee._id,
          name: req.employee.name,
          employeeId: req.employee.employeeId,
          specialization: req.employee.specialization,
          stats: req.employee.stats
        },
        todayStats: {
          todayAssignments: todayAssignments.length,
          completedToday: todayAssignments.filter(a => a.status === 'completed').length,
          pendingTasks,
          totalEarnings: Math.round(earnings)
        },
        // Prefer active assignments for display; fallback to today's if none
        assignments: (activeAssignments.length ? activeAssignments : todayAssignments).map(assignment => ({
          id: assignment.orderNumber,
          customerName: assignment.userId?.name || 'Unknown',
          customerPhone: assignment.serviceAddress?.phone || assignment.userId?.phone || '',
          serviceType: assignment.serviceType,
          location: assignment.serviceAddress?.city || assignment.serviceAddress?.state || '',
          address: assignment.serviceAddress?.fullAddress || '',
          scheduledTime: assignment.scheduledTimeSlot,
          estimatedDuration: (assignment.estimatedDuration ? `${assignment.estimatedDuration} mins` : '30 mins'),
          amount: assignment.totalAmount,
          status: assignment.status,
          priority: assignment.priority || 'medium',
          instructions: assignment.customerNotes || '',
          assignedTime: assignment.assignedAt
        }))
      }
    });
  } catch (error) {
    console.error('Employee dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data'
    });
  }
});

// ==================== ASSIGNMENT MANAGEMENT ROUTES ====================

// Get employee assignments with filters
router.get('/assignments', authenticateEmployee, async (req, res) => {
  try {
    const employeeId = req.employee._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status || 'all';
    const dateFilter = req.query.dateFilter || 'all';
    const search = req.query.search || '';

    let filter = { assignedEmployee: employeeId };

    // Status filter
    if (status !== 'all') {
      filter.status = status;
    }

    // Date filter
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (dateFilter === 'today') {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      filter.scheduledDate = { $gte: today, $lt: tomorrow };
    } else if (dateFilter === 'yesterday') {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      filter.scheduledDate = { $gte: yesterday, $lt: today };
    } else if (dateFilter === 'tomorrow') {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dayAfter = new Date(tomorrow);
      dayAfter.setDate(dayAfter.getDate() + 1);
      filter.scheduledDate = { $gte: tomorrow, $lt: dayAfter };
    } else if (dateFilter === 'week') {
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      filter.scheduledDate = { $gte: weekAgo };
    }

    const skip = (page - 1) * limit;

    let query = Order.find(filter)
      .populate('userId', 'name email phone')
      .sort({ scheduledDate: -1, scheduledTime: 1 })
      .skip(skip)
      .limit(limit);

  const [assignments, totalAssignments] = await Promise.all([
      query,
      Order.countDocuments(filter)
    ]);

    // Apply search filter if provided
    let filteredAssignments = assignments;
    if (search) {
      filteredAssignments = assignments.filter(assignment =>
        assignment.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
        assignment.serviceType?.toLowerCase().includes(search.toLowerCase()) ||
        assignment.address?.area?.toLowerCase().includes(search.toLowerCase()) ||
        assignment._id.toString().includes(search)
      );
    }

    const formattedAssignments = filteredAssignments.map(assignment => ({
      id: assignment.orderNumber,
      customerName: assignment.userId?.name || 'Unknown',
  customerPhone: assignment.serviceAddress?.phone || assignment.userId?.phone || '',
      serviceType: assignment.serviceType,
      location: assignment.serviceAddress?.city || assignment.serviceAddress?.state || '',
      address: assignment.serviceAddress?.fullAddress || '',
      scheduledDate: assignment.scheduledDate?.toISOString().split('T')[0] || '',
      scheduledTime: assignment.scheduledTimeSlot,
      estimatedDuration: (assignment.estimatedDuration ? `${assignment.estimatedDuration} mins` : '30 mins'),
      actualDuration: assignment.actualDuration,
      amount: assignment.totalAmount,
      status: assignment.status,
      priority: assignment.priority || 'medium',
      instructions: assignment.customerNotes || '',
      assignedTime: assignment.assignedAt,
      completedTime: assignment.completedAt,
      customerRating: assignment.rating,
      customerFeedback: assignment.feedback
    }));

    res.json({
      success: true,
      data: {
        assignments: formattedAssignments,
        pagination: {
          page,
          limit,
          total: totalAssignments,
          pages: Math.ceil(totalAssignments / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get assignments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch assignments'
    });
  }
});

// Update assignment status
router.patch('/assignments/:assignmentId/status', authenticateEmployee, async (req, res) => {
  try {
  const { assignmentId } = req.params; // This is orderNumber now
    const { status } = req.body;
    const employeeId = req.employee._id;

    const validStatuses = ['in-progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    // Keep legacy `status` and main `orderStatus` in sync so Admin/User UIs reflect updates
    const statusToOrderStatus = {
      'in-progress': 'in_progress',
      'completed': 'completed',
      'cancelled': 'cancelled'
    };

    const updateData = { 
      status,
      orderStatus: statusToOrderStatus[status] || undefined
    };
    
    if (status === 'in-progress') {
      updateData.startedAt = new Date();
    } else if (status === 'completed') {
      updateData.completedAt = new Date();
      updateData.actualDuration = req.body.actualDuration;
      // Optional: also set actualEndTime for reporting consistency if present in schema
      updateData.actualEndTime = updateData.completedAt;
    }

    // Accept both ObjectId and orderNumber to avoid cross-app mismatches
  // Treat param strictly as orderNumber for employee app
  const match = { orderNumber: assignmentId, assignedEmployee: employeeId };

  let assignment = await Order.findOneAndUpdate(
      match,
      updateData,
      { new: true }
  ).populate('userId', 'name phone');

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found or not assigned to you'
      });
    }

    // Update employee stats if completed
    if (status === 'completed') {
      // If payment is collected onsite (cash/upi/wallet variants), mark as paid
      const markPaidMethods = new Set(['cash', 'gpay', 'phonepe', 'paytm', 'upi', 'wallet']);
      if (assignment && assignment.paymentStatus !== 'completed' && markPaidMethods.has((assignment.paymentMethod || '').toLowerCase())) {
        assignment.paymentStatus = 'completed';
        assignment.paidAt = new Date();
        await assignment.save();
      }
      await Employee.findByIdAndUpdate(employeeId, {
        $inc: { 
          'stats.completedTasks': 1,
          'stats.totalEarnings': Math.round(assignment.totalAmount * req.employee.commissionRate / 100)
        }
      });
    }

    res.json({
      success: true,
      message: `Assignment ${status === 'in-progress' ? 'started' : status} successfully`,
      assignment: {
        id: assignment.orderNumber,
        status: assignment.status,
        completedAt: assignment.completedAt,
        actualDuration: assignment.actualDuration,
        paymentStatus: assignment.paymentStatus
      }
    });
  } catch (error) {
    console.error('Update assignment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update assignment status'
    });
  }
});

// Get full assignment/order details for an employee
router.get('/assignments/:assignmentId/details', authenticateEmployee, async (req, res) => {
  try {
  const { assignmentId } = req.params; // This is orderNumber now
    const employeeId = req.employee._id;

  const order = await Order.findOne({ orderNumber: assignmentId, assignedEmployee: employeeId })
      .populate('userId', 'name phone email')
      .lean();

    if (!order) {
      return res.status(404).json({ success: false, message: 'Assignment not found or not assigned to you' });
    }

    // Prepare a concise payload for UI
    const data = {
      id: order.orderNumber,
      user: order.userId ? { name: order.userId.name, phone: order.userId.phone, email: order.userId.email } : null,
      items: (order.items || []).map(it => ({
        serviceId: it.serviceId,
        packageId: it.packageId,
        serviceName: it.serviceName,
        image: it.image || null,
        packageName: it.packageName,
        vehicleType: it.vehicleType,
        quantity: it.quantity,
        price: it.price,
        includedFeatures: it.includedFeatures || [],
        planDetails: it.planDetails || {},
        addOns: (it.addOns || []).map(a => ({ addOnId: a.addOnId, name: a.name, quantity: a.quantity, price: a.price }))
      })),
      pricing: {
        subtotal: order.subtotal,
        discountAmount: order.discountAmount || 0,
        couponCode: order.couponCode || null,
        totalAmount: order.totalAmount,
        serviceCharge: 0
      },
      schedule: {
        date: order.scheduledDate,
        timeSlot: order.scheduledTimeSlot,
        estimatedDuration: order.estimatedDuration
      },
      payment: {
        method: order.paymentMethod,
        status: order.paymentStatus
      },
      address: {
        fullAddress: order.serviceAddress?.fullAddress || '',
        latitude: order.serviceAddress?.latitude,
        longitude: order.serviceAddress?.longitude,
        city: order.serviceAddress?.city,
        state: order.serviceAddress?.state,
        pincode: order.serviceAddress?.pincode,
        landmark: order.serviceAddress?.landmark
      }
    };

    res.json({ success: true, data });
  } catch (error) {
    console.error('Get assignment details error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch assignment details' });
  }
});

// ==================== TASK MEDIA & ATTENDANCE ROUTES ====================

// Upload attendance selfie (base64 or file)
router.post('/attendance/selfie', authenticateEmployee, upload.single('image'), async (req, res) => {
  try {
  const employeeId = req.employee._id.toString();
  const employeeName = (req.employee.name || 'employee').toLowerCase();
  const slug = employeeName.replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;

    let dataUri;
    if (req.file) {
      const base64 = req.file.buffer.toString('base64');
      dataUri = `data:${req.file.mimetype};base64,${base64}`;
    } else if (req.body.image) {
      dataUri = req.body.image; // expect data URI base64
    }

    if (!dataUri) return res.status(400).json({ success: false, message: 'Image is required' });

  // Store attendance under the employee name folder
  const folder = `bfs/attendance/${slug}`;
  const publicId = `${slug}_${dateStr}`;
  const result = await uploadImage(dataUri, { folder, public_id: publicId, overwrite: true });

    res.json({ success: true, url: result.secure_url, publicId: result.public_id, uploadedAt: result.created_at });
  } catch (err) {
    console.error('Attendance upload error:', err);
    res.status(500).json({ success: false, message: 'Failed to upload selfie' });
  }
});

// Check if today's attendance selfie exists
router.get('/attendance/status', authenticateEmployee, async (req, res) => {
  try {
    const employeeId = req.employee._id.toString();
    const employeeName = (req.employee.name || 'employee').toLowerCase();
    const slug = employeeName.replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;
    // New path: name-based folder
    const folderName = `bfs/attendance/${slug}`;
    const publicIdName = `${folderName}/${slug}_${dateStr}`;
    // Old path fallback: id-based folder (for backward compatibility during transition)
    const folderId = `bfs/attendance/${employeeId}`;
    const publicIdOld = `${folderId}/${slug}_${dateStr}`;

    try {
      const resource = await getResourceByPublicId(publicIdName);
      return res.json({ success: true, doneToday: true, url: resource.secure_url, publicId: resource.public_id });
    } catch (e) {
      // Try old id-based location before returning not found
      try {
        const legacy = await getResourceByPublicId(publicIdOld);
        return res.json({ success: true, doneToday: true, url: legacy.secure_url, publicId: legacy.public_id });
      } catch {
        return res.json({ success: true, doneToday: false });
      }
    }
  } catch (err) {
    console.error('Attendance status error:', err);
    res.status(500).json({ success: false, message: 'Failed to check attendance' });
  }
});

// Get tasks assigned to employee (simple)
router.get('/tasks', authenticateEmployee, async (req, res) => {
  try {
    const tasks = await Order.find({ assignedEmployee: req.employee._id })
      .select('orderNumber serviceType serviceAddress scheduledDate scheduledTimeSlot status workImages totalAmount')
      .sort({ createdAt: -1 });
    res.json({ success: true, tasks });
  } catch (err) {
    console.error('Get tasks error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch tasks' });
  }
});

// Upload before/after images for a task
router.post('/tasks/:orderId/images', authenticateEmployee, upload.fields([{ name: 'before', maxCount: 1 }, { name: 'after', maxCount: 1 }]), async (req, res) => {
  try {
    const { orderId } = req.params; // orderNumber
    const order = await Order.findOne({ orderNumber: orderId, assignedEmployee: req.employee._id });
    if (!order) return res.status(404).json({ success: false, message: 'Task not found' });

    // Use human-readable orderNumber for Cloudinary organization
    const folder = `bfs/orders/${order.orderNumber}`;
    const updates = {};

    const processPart = async (field) => {
      const file = req.files?.[field]?.[0];
      const input = req.body?.[field];
      if (!file && !input) return null;
      const dataUri = file ? `data:${file.mimetype};base64,${file.buffer.toString('base64')}` : input;
      const result = await uploadImage(dataUri, { folder, public_id: `${order.orderNumber}_${field}`, overwrite: true });
      return { url: result.secure_url, publicId: result.public_id, uploadedAt: new Date(result.created_at) };
    };

    const [before, after] = await Promise.all([processPart('before'), processPart('after')]);
    if (before) updates['workImages.before'] = before;
    if (after) updates['workImages.after'] = after;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: 'No images provided' });
    }

  const updated = await Order.findOneAndUpdate({ orderNumber: orderId, assignedEmployee: req.employee._id }, { $set: updates }, { new: true }).select('workImages');
    res.json({ success: true, workImages: updated.workImages });
  } catch (err) {
    console.error('Task images upload error:', err);
    res.status(500).json({ success: false, message: 'Failed to upload images' });
  }
});

// Mark task completed (requires both images present)
router.post('/tasks/:orderId/complete', authenticateEmployee, async (req, res) => {
  try {
  const { orderId } = req.params; // orderNumber
  const order = await Order.findOne({ orderNumber: orderId, assignedEmployee: req.employee._id });
    if (!order) return res.status(404).json({ success: false, message: 'Task not found' });
    if (!order.workImages?.before?.url || !order.workImages?.after?.url) {
      return res.status(400).json({ success: false, message: 'Before and After images are required' });
    }

    order.status = 'completed';
    order.orderStatus = 'completed';
    order.completedAt = new Date();
    // If onsite payment method, mark as paid
    const markPaidMethods = new Set(['cash', 'gpay', 'phonepe', 'paytm', 'upi', 'wallet']);
    if (order.paymentStatus !== 'completed' && markPaidMethods.has((order.paymentMethod || '').toLowerCase())) {
      order.paymentStatus = 'completed';
      order.paidAt = new Date();
    }
    await order.save();
    res.json({ success: true, message: 'Task marked as completed' });
  } catch (err) {
    console.error('Complete task error:', err);
    res.status(500).json({ success: false, message: 'Failed to complete task' });
  }
});

// ==================== COMPLETED TASKS ROUTES ====================

// Get completed tasks
router.get('/completed', authenticateEmployee, async (req, res) => {
  try {
    const employeeId = req.employee._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const dateFilter = req.query.dateFilter || 'all';
    const ratingFilter = req.query.ratingFilter || 'all';
    const search = req.query.search || '';

    let filter = { 
      assignedEmployee: employeeId, 
      status: 'completed' 
    };

    // Date filter
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (dateFilter === 'today') {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      filter.completedAt = { $gte: today, $lt: tomorrow };
    } else if (dateFilter === 'yesterday') {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      filter.completedAt = { $gte: yesterday, $lt: today };
    } else if (dateFilter === 'week') {
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      filter.completedAt = { $gte: weekAgo };
    } else if (dateFilter === 'month') {
      const monthAgo = new Date(today);
      monthAgo.setDate(monthAgo.getDate() - 30);
      filter.completedAt = { $gte: monthAgo };
    }

    // Rating filter
    if (ratingFilter !== 'all') {
      filter.rating = { $gte: parseInt(ratingFilter) };
    }

    const skip = (page - 1) * limit;

    const [completedTasks, totalTasks] = await Promise.all([
      Order.find(filter)
        .populate('userId', 'name email phone')
        .sort({ completedAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments(filter)
    ]);

    // Apply search filter
    let filteredTasks = completedTasks;
    if (search) {
      filteredTasks = completedTasks.filter(task =>
        task.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
        task.serviceType?.toLowerCase().includes(search.toLowerCase()) ||
        task._id.toString().includes(search)
      );
    }

    // Calculate stats
    const totalEarnings = filteredTasks.reduce((sum, task) => 
      sum + Math.round(task.totalAmount * req.employee.commissionRate / 100), 0
    );
    const averageRating = filteredTasks.length > 0 
      ? (filteredTasks.reduce((sum, task) => sum + (task.rating || 0), 0) / filteredTasks.length).toFixed(1)
      : 0;
    const fiveStarTasks = filteredTasks.filter(task => task.rating === 5).length;

    const formattedTasks = filteredTasks.map(task => ({
      id: task._id,
      customerName: task.userId?.name || 'Unknown',
      customerPhone: task.userId?.phone || '',
      serviceType: task.serviceType,
      location: task.address?.area || task.address?.city || '',
      address: `${task.address?.street || ''}, ${task.address?.area || ''}, ${task.address?.city || ''}`,
      completedDate: task.completedAt?.toISOString().split('T')[0] || '',
      completedTime: task.completedAt?.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }) || '',
      scheduledTime: task.scheduledTime,
      estimatedDuration: task.estimatedDuration || '30 mins',
      actualDuration: task.actualDuration || 'N/A',
      amount: task.totalAmount,
      customerRating: task.rating || 0,
      customerFeedback: task.feedback || '',
      earnings: Math.round(task.totalAmount * req.employee.commissionRate / 100)
    }));

    res.json({
      success: true,
      data: {
        tasks: formattedTasks,
        stats: {
          totalTasks: filteredTasks.length,
          totalEarnings,
          averageRating: parseFloat(averageRating),
          fiveStarTasks
        },
        pagination: {
          page,
          limit,
          total: totalTasks,
          pages: Math.ceil(totalTasks / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get completed tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch completed tasks'
    });
  }
});

// ==================== SCHEDULE ROUTES ====================

// Get employee schedule
router.get('/schedule', authenticateEmployee, async (req, res) => {
  try {
    const employeeId = req.employee._id;
    const startDate = req.query.startDate || new Date().toISOString().split('T')[0];
    const endDate = req.query.endDate;

    let filter = { assignedEmployee: employeeId };

    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.scheduledDate = { $gte: start, $lte: end };
      } else {
        // Get schedule for the next 30 days
        const end = new Date(start);
        end.setDate(end.getDate() + 30);
        filter.scheduledDate = { $gte: start, $lt: end };
      }
    }

    const assignments = await Order.find(filter)
      .populate('userId', 'name phone')
      .sort({ scheduledDate: 1, scheduledTime: 1 });

    // Group assignments by date
    const scheduleData = {};
    assignments.forEach(assignment => {
      const dateKey = assignment.scheduledDate?.toISOString().split('T')[0];
      if (!scheduleData[dateKey]) {
        scheduleData[dateKey] = [];
      }
      
      scheduleData[dateKey].push({
        id: assignment._id,
        customerName: assignment.userId?.name || 'Unknown',
        customerPhone: assignment.userId?.phone || '',
        serviceType: assignment.serviceType,
        location: assignment.address?.area || assignment.address?.city || '',
        address: `${assignment.address?.street || ''}, ${assignment.address?.area || ''}, ${assignment.address?.city || ''}`,
        time: assignment.scheduledTime,
        duration: assignment.estimatedDuration || '30 mins',
        amount: assignment.totalAmount,
        status: assignment.status,
        priority: assignment.priority || 'medium',
        instructions: assignment.specialInstructions || ''
      });
    });

    res.json({
      success: true,
      data: {
        scheduleData
      }
    });
  } catch (error) {
    console.error('Get schedule error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch schedule'
    });
  }
});

// ==================== PROFILE ROUTES ====================

// Get employee profile
router.get('/profile', authenticateEmployee, async (req, res) => {
  try {
    const employee = await Employee.findById(req.employee._id)
      .select('-password')
      .populate('createdBy', 'name email');

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    // Get additional stats
    const monthlyStats = await Order.aggregate([
      {
        $match: {
          assignedEmployee: employee._id,
          status: 'completed',
          completedAt: { $gte: new Date(new Date().getFullYear(), 0, 1) }
        }
      },
      {
        $group: {
          _id: { month: { $month: '$completedAt' } },
          earnings: { $sum: { $multiply: ['$totalAmount', employee.commissionRate / 100] } },
          tasks: { $sum: 1 }
        }
      },
      { $sort: { '_id.month': 1 } }
    ]);

    res.json({
      success: true,
      data: {
        employee: {
          ...employee.toObject(),
          monthlyStats: monthlyStats.map(stat => ({
            month: stat._id.month,
            earnings: Math.round(stat.earnings),
            tasks: stat.tasks
          }))
        }
      }
    });
  } catch (error) {
    console.error('Get employee profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile'
    });
  }
});

// Update employee profile
router.put('/profile', authenticateEmployee, async (req, res) => {
  try {
    const employeeId = req.employee._id;
    const allowedUpdates = ['name', 'phone', 'address', 'emergencyContact'];
    const updateData = {};

    // Filter allowed updates
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updateData[key] = req.body[key];
      }
    });

    const employee = await Employee.findByIdAndUpdate(
      employeeId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      employee
    });
  } catch (error) {
    console.error('Update employee profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
});

export default router;

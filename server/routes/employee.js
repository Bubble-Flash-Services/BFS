import express from 'express';
import Employee from '../models/Employee.js';
import Order from '../models/Order.js';
import { authenticateEmployee } from '../middleware/authAdmin.js';

const router = express.Router();

// ==================== EMPLOYEE DASHBOARD ROUTES ====================

// Get employee dashboard data
router.get('/dashboard', authenticateEmployee, async (req, res) => {
  try {
    const employeeId = req.employee._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get today's assignments
    const todayAssignments = await Order.find({
      assignedEmployee: employeeId,
      scheduledDate: { $gte: today, $lt: tomorrow }
    }).populate('userId', 'name phone');

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
        assignments: todayAssignments.map(assignment => ({
          id: assignment._id,
          customerName: assignment.userId?.name || 'Unknown',
          customerPhone: assignment.userId?.phone || '',
          serviceType: assignment.serviceType,
          location: assignment.address?.area || assignment.address?.city || '',
          address: `${assignment.address?.street || ''}, ${assignment.address?.area || ''}, ${assignment.address?.city || ''}`,
          scheduledTime: assignment.scheduledTime,
          estimatedDuration: assignment.estimatedDuration || '30 mins',
          amount: assignment.totalAmount,
          status: assignment.status,
          priority: assignment.priority || 'medium',
          instructions: assignment.specialInstructions || '',
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
      id: assignment._id,
      customerName: assignment.userId?.name || 'Unknown',
      customerPhone: assignment.userId?.phone || '',
      serviceType: assignment.serviceType,
      location: assignment.address?.area || assignment.address?.city || '',
      address: `${assignment.address?.street || ''}, ${assignment.address?.area || ''}, ${assignment.address?.city || ''}`,
      scheduledDate: assignment.scheduledDate?.toISOString().split('T')[0] || '',
      scheduledTime: assignment.scheduledTime,
      estimatedDuration: assignment.estimatedDuration || '30 mins',
      actualDuration: assignment.actualDuration,
      amount: assignment.totalAmount,
      status: assignment.status,
      priority: assignment.priority || 'medium',
      instructions: assignment.specialInstructions || '',
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
    const { assignmentId } = req.params;
    const { status } = req.body;
    const employeeId = req.employee._id;

    const validStatuses = ['in-progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const updateData = { status };
    
    if (status === 'in-progress') {
      updateData.startedAt = new Date();
    } else if (status === 'completed') {
      updateData.completedAt = new Date();
      updateData.actualDuration = req.body.actualDuration;
    }

    const assignment = await Order.findOneAndUpdate(
      { _id: assignmentId, assignedEmployee: employeeId },
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
        id: assignment._id,
        status: assignment.status,
        completedAt: assignment.completedAt,
        actualDuration: assignment.actualDuration
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

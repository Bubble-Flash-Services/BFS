import express from 'express';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get dashboard stats
router.get('/dashboard/stats', authenticateToken, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get total bookings count
    const totalBookings = await Order.countDocuments();

    // Get today's bookings
    const todayBookings = await Order.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow }
    });

    // Get total revenue
    const revenueResult = await Order.aggregate([
      { $match: { status: { $in: ['completed', 'paid'] } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Get cancellation requests
    const cancellationRequests = await Order.countDocuments({
      status: 'cancelled'
    });

    res.json({
      success: true,
      data: {
        bookingsCount: totalBookings,
        todayBookings,
        totalRevenue,
        cancellationRequests
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

// Get current customers (today's orders)
router.get('/dashboard/current-customers', authenticateToken, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const currentCustomers = await Order.find({
      createdAt: { $gte: today, $lt: tomorrow }
    })
    .populate('user', 'name phone')
    .populate('address', 'area')
    .select('user address services totalAmount paymentMethod status createdAt')
    .sort({ createdAt: -1 });

    const formattedCustomers = currentCustomers.map(order => ({
      id: order._id,
      customer: order.user?.name || 'Unknown',
      contactNo: order.user?.phone || 'N/A',
      location: order.address?.area || 'N/A',
      serviceMode: order.services?.[0]?.category || 'N/A',
      paymentMethod: order.paymentMethod || 'N/A',
      plan: order.services?.[0]?.name || 'N/A',
      date: order.createdAt.toISOString().split('T')[0]
    }));

    res.json({
      success: true,
      data: formattedCustomers
    });
  } catch (error) {
    console.error('Current customers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch current customers'
    });
  }
});

// Get monthly sales and revenue data
router.get('/dashboard/monthly-data', authenticateToken, async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    
    const monthlyData = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(currentYear, 0, 1),
            $lt: new Date(currentYear + 1, 0, 1)
          }
        }
      },
      {
        $group: {
          _id: { month: { $month: '$createdAt' } },
          sales: { $sum: 1 },
          revenue: { 
            $sum: { 
              $cond: [
                { $in: ['$status', ['completed', 'paid']] },
                '$totalAmount',
                0
              ]
            }
          }
        }
      },
      {
        $sort: { '_id.month': 1 }
      }
    ]);

    // Initialize arrays for all 12 months
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const sales = new Array(12).fill(0);
    const revenue = new Array(12).fill(0);

    // Fill in the actual data
    monthlyData.forEach(item => {
      const monthIndex = item._id.month - 1;
      sales[monthIndex] = item.sales;
      revenue[monthIndex] = item.revenue;
    });

    res.json({
      success: true,
      data: {
        months,
        sales,
        revenue
      }
    });
  } catch (error) {
    console.error('Monthly data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch monthly data'
    });
  }
});

export default router;

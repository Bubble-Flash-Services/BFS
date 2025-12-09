import express from 'express';
import Order from '../models/Order.js';
import PaintingQuote from '../models/PaintingQuote.js';
import MoversPackers from '../models/MoversPackers.js';
import VehicleCheckupBooking from '../models/VehicleCheckupBooking.js';
import { authenticateAdmin } from '../middleware/authAdmin.js';

const router = express.Router();

// Get all orders (admin view) with service type filtering
router.get('/', authenticateAdmin, async (req, res) => {
  try {
    const { serviceType, status } = req.query;
    
    // Handle service-specific filtering
    if (serviceType && serviceType !== 'all') {
      let serviceOrders = [];
      
      switch (serviceType) {
        case 'painting':
          const paintingFilter = status && status !== 'all' ? { status } : {};
          const paintingQuotes = await PaintingQuote.find(paintingFilter)
            .populate('userId', 'name email phone')
            .sort({ createdAt: -1 })
            .limit(1000);
          serviceOrders = paintingQuotes.map(q => ({
            _id: q._id,
            orderNumber: `PNT-${q._id.toString().slice(-8)}`,
            userId: q.userId,
            items: [{
              serviceName: `${q.serviceType} - ${q.propertyType}`,
              name: 'Painting Service',
              category: 'Painting Services'
            }],
            totalAmount: q.quotedAmount || 0,
            orderStatus: q.status,
            paymentStatus: q.paymentStatus,
            createdAt: q.createdAt,
            serviceAddress: { fullAddress: q.address }
          }));
          break;
          
        case 'movers-packers':
          const moversFilter = status && status !== 'all' ? { status } : {};
          const moversBookings = await MoversPackers.find(moversFilter)
            .populate('userId', 'name email phone')
            .sort({ createdAt: -1 })
            .limit(1000);
          serviceOrders = moversBookings.map(m => ({
            _id: m._id,
            orderNumber: `MP-${m._id.toString().slice(-8)}`,
            userId: m.userId,
            items: [{
              serviceName: `${m.moveType} - ${m.homeSize}`,
              name: 'Movers & Packers',
              category: 'Movers & Packers'
            }],
            totalAmount: m.estimatedPrice?.totalPrice || 0,
            orderStatus: m.status,
            paymentStatus: m.paymentStatus,
            createdAt: m.createdAt,
            serviceAddress: { fullAddress: m.sourceCity?.fullAddress || 'N/A' }
          }));
          break;
          
        case 'vehicle-checkup':
          const vehicleFilter = status && status !== 'all' ? { status } : {};
          const vehicleBookings = await VehicleCheckupBooking.find(vehicleFilter)
            .populate('userId', 'name email phone')
            .sort({ createdAt: -1 })
            .limit(1000);
          serviceOrders = vehicleBookings.map(v => ({
            _id: v._id,
            orderNumber: `VC-${v._id.toString().slice(-8)}`,
            userId: v.userId,
            items: [{
              serviceName: v.serviceType || 'Vehicle Checkup',
              name: 'Vehicle Checkup',
              category: 'Vehicle Checkup'
            }],
            totalAmount: v.totalAmount || 0,
            orderStatus: v.status,
            paymentStatus: v.paymentStatus,
            createdAt: v.createdAt,
            serviceAddress: { fullAddress: v.address || 'N/A' }
          }));
          break;
          
        case 'car-wash':
          const carWashFilter = { 'items.category': 'Car Wash' };
          if (status && status !== 'all') carWashFilter.orderStatus = status;
          serviceOrders = await Order.find(carWashFilter)
            .populate('userId', 'name email phone')
            .sort({ createdAt: -1 })
            .limit(1000);
          break;
          
        case 'green-clean':
          const greenCleanFilter = { 'items.category': 'Green & Clean' };
          if (status && status !== 'all') greenCleanFilter.orderStatus = status;
          serviceOrders = await Order.find(greenCleanFilter)
            .populate('userId', 'name email phone')
            .sort({ createdAt: -1 })
            .limit(1000);
          break;
          
        case 'laundry':
          const laundryFilter = { 'items.category': 'Laundry' };
          if (status && status !== 'all') laundryFilter.orderStatus = status;
          serviceOrders = await Order.find(laundryFilter)
            .populate('userId', 'name email phone')
            .sort({ createdAt: -1 })
            .limit(1000);
          break;
          
        default:
          serviceOrders = await Order.find()
            .populate('userId', 'name email phone')
            .sort({ createdAt: -1 })
            .limit(1000);
      }
      
      return res.json({
        success: true,
        data: serviceOrders
      });
    }
    
    // Default behavior - get all orders
    const filter = status && status !== 'all' ? { orderStatus: status } : {};
    const orders = await Order.find(filter)
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(1000);

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
});

// Get order statistics
router.get('/stats', authenticateAdmin, async (req, res) => {
  try {
    const [total, pending, completed, cancelled, revenueData] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ orderStatus: 'pending' }),
      Order.countDocuments({ orderStatus: 'completed' }),
      Order.countDocuments({ orderStatus: 'cancelled' }),
      Order.aggregate([
        { $match: { orderStatus: { $ne: 'cancelled' } } },
        { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
      ])
    ]);

    res.json({
      success: true,
      data: {
        total,
        pending,
        completed,
        cancelled,
        totalRevenue: revenueData[0]?.totalRevenue || 0
      }
    });
  } catch (error) {
    console.error('Error fetching order stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order statistics',
      error: error.message
    });
  }
});

// Get single order details
router.get('/:orderId', authenticateAdmin, async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate('userId', 'name email phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message
    });
  }
});

// Update order status
router.patch('/:orderId/status', authenticateAdmin, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'assigned', 'in_progress', 'completed', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus: status },
      { new: true }
    ).populate('userId', 'name email phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message
    });
  }
});

// Delete order (admin only)
router.delete('/:orderId', authenticateAdmin, async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findByIdAndDelete(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete order',
      error: error.message
    });
  }
});

export default router;

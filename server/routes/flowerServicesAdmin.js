import express from "express";
import FlowerBooking from "../models/FlowerBooking.js";
import Order from "../models/Order.js";
import { authenticateAdmin } from "../middleware/authAdmin.js";

const router = express.Router();

// Helper function to normalize status from Order to FlowerBooking format
function normalizeOrderStatus(orderStatus) {
  const statusMap = {
    'in_progress': 'preparing',
    'confirmed': 'confirmed',
    'pending': 'pending',
    'completed': 'delivered',
    'cancelled': 'cancelled'
  };
  return statusMap[orderStatus] || orderStatus;
}

// Get all bookings with optional filters (includes both direct bookings and cart orders)
router.get("/bookings", authenticateAdmin, async (req, res) => {
  try {
    const { status, category, startDate, endDate } = req.query;

    // Build filter for direct bookings
    const directBookingFilter = {};
    if (status) directBookingFilter.status = status;
    if (category) directBookingFilter.category = category;

    if (startDate || endDate) {
      directBookingFilter.createdAt = {};
      if (startDate) directBookingFilter.createdAt.$gte = new Date(startDate);
      if (endDate) directBookingFilter.createdAt.$lte = new Date(endDate);
    }

    // Build filter for cart orders
    const orderFilter = { 
      $or: [
        { 'items.type': 'flower-services' },
        { 'items.serviceName': 'flowers' }
      ]
    };
    if (status) {
      orderFilter.orderStatus = status === 'preparing' ? 'in_progress' : status;
    }
    if (startDate || endDate) {
      orderFilter.createdAt = {};
      if (startDate) orderFilter.createdAt.$gte = new Date(startDate);
      if (endDate) orderFilter.createdAt.$lte = new Date(endDate);
    }

    // Fetch both direct bookings and cart orders
    const [directBookings, cartOrders] = await Promise.all([
      FlowerBooking.find(directBookingFilter)
        .populate("userId", "name email phone")
        .populate("assignedDeliveryPerson", "name phone email")
        .sort({ createdAt: -1 }),
      Order.find(orderFilter)
        .populate("userId", "name email phone")
        .populate("assignedEmployee", "name phone email")
        .sort({ createdAt: -1 })
    ]);

    // Transform cart orders to match booking structure for unified display
    const transformedCartOrders = cartOrders.map(order => {
      const flowerServiceItem = order.items.find(item => item.type === 'flower-services' || item.serviceName === 'flowers');
      return {
        _id: order._id,
        userId: order.userId,
        bookingType: 'cart',
        orderNumber: order.orderNumber,
        serviceType: flowerServiceItem?.category || 'flower-services',
        itemName: flowerServiceItem?.serviceName || 'N/A',
        category: flowerServiceItem?.category || 'bouquet',
        quantity: flowerServiceItem?.quantity || 1,
        serviceLocation: {
          fullAddress: order.serviceAddress?.fullAddress,
          city: order.serviceAddress?.city,
          pincode: order.serviceAddress?.pincode
        },
        contactPhone: order.serviceAddress?.phone || order.userId?.phone,
        deliveryDate: order.scheduledDate || order.createdAt,
        pricing: {
          totalPrice: order.totalAmount || flowerServiceItem?.price
        },
        status: normalizeOrderStatus(order.orderStatus || order.status || 'pending'),
        assignedDeliveryPerson: order.assignedEmployee,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      };
    });

    // Mark direct bookings with bookingType for clarity
    const markedDirectBookings = directBookings.map(booking => ({
      ...booking.toObject(),
      bookingType: 'direct'
    }));

    // Combine both types
    const allBookings = [...markedDirectBookings, ...transformedCartOrders];
    
    // Sort by creation date
    allBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Calculate combined stats
    const directStats = await FlowerBooking.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const orderStats = await Order.aggregate([
      { $match: { 
        $or: [
          { 'items.type': 'flower-services' },
          { 'items.serviceName': 'flowers' }
        ]
      } },
      {
        $group: {
          _id: "$orderStatus",
          count: { $sum: 1 },
        },
      },
    ]);

    const statsObj = {};
    directStats.forEach(stat => {
      statsObj[stat._id] = (statsObj[stat._id] || 0) + stat.count;
    });
    orderStats.forEach(stat => {
      statsObj[stat._id] = (statsObj[stat._id] || 0) + stat.count;
    });

    res.json({
      success: true,
      data: {
        bookings: allBookings,
        stats: statsObj,
        total: allBookings.length,
        breakdown: {
          directBookings: directBookings.length,
          cartOrders: cartOrders.length
        }
      },
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
});

// Get specific booking
router.get("/booking/:id", authenticateAdmin, async (req, res) => {
  try {
    const booking = await FlowerBooking.findById(req.params.id)
      .populate("userId", "name email phone")
      .populate("assignedDeliveryPerson", "name phone email");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch booking",
      error: error.message,
    });
  }
});

// Assign delivery person to booking
router.patch("/booking/:id/assign", authenticateAdmin, async (req, res) => {
  try {
    const { employeeId } = req.body;

    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: "Employee ID is required",
      });
    }

    const booking = await FlowerBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    booking.assignedDeliveryPerson = employeeId;
    if (booking.status === 'pending') {
      booking.status = "confirmed";
    }
    await booking.save();

    const updatedBooking = await FlowerBooking.findById(
      req.params.id
    ).populate("assignedDeliveryPerson", "name phone email");

    res.json({
      success: true,
      message: "Delivery person assigned successfully",
      data: updatedBooking,
    });
  } catch (error) {
    console.error("Error assigning delivery person:", error);
    res.status(500).json({
      success: false,
      message: "Failed to assign delivery person",
      error: error.message,
    });
  }
});

// Update booking status
router.patch("/booking/:id/status", authenticateAdmin, async (req, res) => {
  try {
    const { status, adminNotes } = req.body;

    const validStatuses = [
      "pending",
      "confirmed",
      "preparing",
      "out-for-delivery",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const booking = await FlowerBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    booking.status = status;
    if (adminNotes) booking.adminNotes = adminNotes;

    // Set delivery time when delivered
    if (status === "delivered" && !booking.actualDeliveryTime) {
      booking.actualDeliveryTime = new Date();
    }

    await booking.save();

    const updatedBooking = await FlowerBooking.findById(
      req.params.id
    ).populate("assignedDeliveryPerson", "name phone email");

    res.json({
      success: true,
      message: "Status updated successfully",
      data: updatedBooking,
    });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update status",
      error: error.message,
    });
  }
});

// Update admin notes
router.patch("/booking/:id/notes", authenticateAdmin, async (req, res) => {
  try {
    const { adminNotes } = req.body;

    const booking = await FlowerBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    booking.adminNotes = adminNotes;
    await booking.save();

    res.json({
      success: true,
      message: "Notes updated successfully",
      data: booking,
    });
  } catch (error) {
    console.error("Error updating notes:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update notes",
      error: error.message,
    });
  }
});

// Get dashboard statistics
router.get("/stats", authenticateAdmin, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    // Get counts from direct bookings
    const totalDirectBookings = await FlowerBooking.countDocuments(dateFilter);

    // Get counts from cart orders
    const orderFilter = { 
      $or: [
        { 'items.type': 'flower-services' },
        { 'items.serviceName': 'flowers' }
      ],
      ...dateFilter 
    };
    const totalCartOrders = await Order.countDocuments(orderFilter);

    const statusCounts = await FlowerBooking.aggregate([
      { $match: dateFilter },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const orderStatusCounts = await Order.aggregate([
      { $match: orderFilter },
      { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
    ]);

    const categoryCounts = await FlowerBooking.aggregate([
      { $match: dateFilter },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    const directRevenue = await FlowerBooking.aggregate([
      { $match: { ...dateFilter, paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$pricing.totalPrice" } } },
    ]);

    const cartRevenue = await Order.aggregate([
      { 
        $match: { 
          ...orderFilter,
          paymentStatus: 'completed'
        } 
      },
      { $unwind: "$items" },
      { $match: { 
        $or: [
          { "items.type": "flower-services" },
          { "items.serviceName": "flowers" }
        ]
      } },
      { 
        $group: { 
          _id: null, 
          total: { $sum: { $multiply: ["$items.price", "$items.quantity"] } } 
        } 
      },
    ]);

    // Combine status counts
    const combinedStatusCounts = {};
    statusCounts.forEach(stat => {
      combinedStatusCounts[stat._id] = (combinedStatusCounts[stat._id] || 0) + stat.count;
    });
    orderStatusCounts.forEach(stat => {
      combinedStatusCounts[stat._id] = (combinedStatusCounts[stat._id] || 0) + stat.count;
    });

    const totalRevenue = (directRevenue[0]?.total || 0) + (cartRevenue[0]?.total || 0);
    const totalBookings = totalDirectBookings + totalCartOrders;

    res.json({
      success: true,
      data: {
        totalBookings,
        directBookings: totalDirectBookings,
        cartOrders: totalCartOrders,
        statusCounts: combinedStatusCounts,
        categoryCounts: categoryCounts.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
        totalRevenue,
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch statistics",
      error: error.message,
    });
  }
});

export default router;

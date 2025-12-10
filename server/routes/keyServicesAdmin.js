import express from "express";
import KeyServiceBooking from "../models/KeyServiceBooking.js";
import { authenticateAdmin } from "../middleware/authAdmin.js";

const router = express.Router();

// Get all bookings with optional filters
router.get("/bookings", authenticateAdmin, async (req, res) => {
  try {
    const { status, isEmergency, startDate, endDate } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (isEmergency !== undefined) filter.isEmergency = isEmergency === "true";

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const bookings = await KeyServiceBooking.find(filter)
      .populate("userId", "name email phone")
      .populate("assignedTechnician", "name phone email")
      .sort({ createdAt: -1 });

    const stats = await KeyServiceBooking.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const statsObj = stats.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        bookings,
        stats: statsObj,
        total: bookings.length,
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
    const booking = await KeyServiceBooking.findById(req.params.id)
      .populate("userId", "name email phone")
      .populate("assignedTechnician", "name phone email");

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

// Assign technician to booking
router.patch("/booking/:id/assign", authenticateAdmin, async (req, res) => {
  try {
    const { employeeId } = req.body;

    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: "Employee ID is required",
      });
    }

    const booking = await KeyServiceBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    booking.assignedTechnician = employeeId;
    booking.status = "assigned";
    await booking.save();

    const updatedBooking = await KeyServiceBooking.findById(
      req.params.id
    ).populate("assignedTechnician", "name phone email");

    res.json({
      success: true,
      message: "Technician assigned successfully",
      data: updatedBooking,
    });
  } catch (error) {
    console.error("Error assigning technician:", error);
    res.status(500).json({
      success: false,
      message: "Failed to assign technician",
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
      "assigned",
      "in-progress",
      "completed",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const booking = await KeyServiceBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    booking.status = status;
    if (adminNotes) booking.adminNotes = adminNotes;

    // Set service times based on status
    if (status === "in-progress" && !booking.serviceStartTime) {
      booking.serviceStartTime = new Date();
    } else if (status === "completed" && !booking.serviceEndTime) {
      booking.serviceEndTime = new Date();
    }

    await booking.save();

    const updatedBooking = await KeyServiceBooking.findById(
      req.params.id
    ).populate("assignedTechnician", "name phone email");

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

    const booking = await KeyServiceBooking.findById(req.params.id);

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

    const totalBookings = await KeyServiceBooking.countDocuments(dateFilter);
    const emergencyBookings = await KeyServiceBooking.countDocuments({
      ...dateFilter,
      isEmergency: true,
    });

    const statusCounts = await KeyServiceBooking.aggregate([
      { $match: dateFilter },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const serviceTypeCounts = await KeyServiceBooking.aggregate([
      { $match: dateFilter },
      { $group: { _id: "$serviceType", count: { $sum: 1 } } },
    ]);

    const totalRevenue = await KeyServiceBooking.aggregate([
      { $match: { ...dateFilter, paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$pricing.totalPrice" } } },
    ]);

    res.json({
      success: true,
      data: {
        totalBookings,
        emergencyBookings,
        statusCounts: statusCounts.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
        serviceTypeCounts: serviceTypeCounts.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
        totalRevenue: totalRevenue[0]?.total || 0,
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

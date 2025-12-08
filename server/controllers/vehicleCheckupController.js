// controllers/vehicleCheckupController.js
import VehicleCheckupBooking from "../models/VehicleCheckupBooking.js";
import mongoose from "mongoose";

// POST /api/vehicle-checkup/booking
export const createVehicleCheckupBooking = async (req, res) => {
  try {
    const userId = req.user?.id || req.body.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const {
      vehicleType,
      packageType,
      packageName,
      basePrice,
      addOns,
      vehicleDetails,
      address,
      scheduledDate,
      scheduledTime,
      payment,
      notes,
    } = req.body;

    // Validation
    if (!vehicleType || !packageType || !packageName || !basePrice) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Calculate totals
    const addOnTotal = (addOns || []).reduce(
      (sum, addon) => sum + (addon.price || 0),
      0
    );
    const totalAmount = basePrice + addOnTotal;
    const payableAmount = totalAmount; // Can add taxes/discounts here

    const booking = await VehicleCheckupBooking.create({
      userId,
      vehicleType,
      packageType,
      packageName,
      basePrice,
      addOns: addOns || [],
      totalAmount,
      payableAmount,
      vehicleDetails,
      address,
      scheduledDate,
      scheduledTime,
      payment: {
        status: payment?.status || "pending",
        method: payment?.method,
        transactionId: payment?.transactionId,
      },
      notes,
    });

    return res.status(201).json({ success: true, data: booking });
  } catch (err) {
    console.error("createVehicleCheckupBooking", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/vehicle-checkup/booking/:id
export const getVehicleCheckupBooking = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID" });
    }

    const booking = await VehicleCheckupBooking.findById(id)
      .populate("userId", "name email phone")
      .populate("assignedEmployee", "name phone email")
      .lean();

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    return res.json({ success: true, data: booking });
  } catch (err) {
    console.error("getVehicleCheckupBooking", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/vehicle-checkup/bookings (User bookings)
export const getUserVehicleCheckupBookings = async (req, res) => {
  try {
    const userId = req.user?.id || req.query.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const bookings = await VehicleCheckupBooking.find({ userId })
      .sort("-createdAt")
      .populate("assignedEmployee", "name phone")
      .lean();

    return res.json({ success: true, data: bookings });
  } catch (err) {
    console.error("getUserVehicleCheckupBookings", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ADMIN: GET /api/vehicle-checkup/admin/bookings
export const listVehicleCheckupBookingsAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 30, status, vehicleType } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (vehicleType) filter.vehicleType = vehicleType;

    const skip = (Number(page) - 1) * Number(limit);
    const bookings = await VehicleCheckupBooking.find(filter)
      .sort("-createdAt")
      .skip(skip)
      .limit(Number(limit))
      .populate("userId", "name email phone")
      .populate("assignedEmployee", "name phone email")
      .lean();

    const total = await VehicleCheckupBooking.countDocuments(filter);

    return res.json({
      success: true,
      data: bookings,
      meta: { total, page: Number(page), limit: Number(limit) },
    });
  } catch (err) {
    console.error("listVehicleCheckupBookingsAdmin", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ADMIN: PUT /api/vehicle-checkup/admin/bookings/:id/status
export const updateVehicleCheckupBookingStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID" });
    }

    const validStatuses = [
      "pending",
      "confirmed",
      "assigned",
      "in-progress",
      "inspection-completed",
      "report-generated",
      "completed",
      "cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const booking = await VehicleCheckupBooking.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    return res.json({ success: true, data: booking });
  } catch (err) {
    console.error("updateVehicleCheckupBookingStatus", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ADMIN: PUT /api/vehicle-checkup/admin/bookings/:id/assign
export const assignEmployeeToCheckup = async (req, res) => {
  try {
    const id = req.params.id;
    const { employeeId } = req.body;

    if (!mongoose.isValidObjectId(id) || !mongoose.isValidObjectId(employeeId)) {
      return res.status(400).json({ success: false, message: "Invalid ID" });
    }

    const booking = await VehicleCheckupBooking.findByIdAndUpdate(
      id,
      {
        assignedEmployee: employeeId,
        status: "assigned",
        updatedAt: new Date(),
      },
      { new: true }
    ).populate("assignedEmployee", "name phone email");

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    return res.json({ success: true, data: booking });
  } catch (err) {
    console.error("assignEmployeeToCheckup", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ADMIN/EMPLOYEE: PUT /api/vehicle-checkup/bookings/:id/report
export const updateInspectionReport = async (req, res) => {
  try {
    const id = req.params.id;
    const { findings, recommendations, reportUrl } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID" });
    }

    const booking = await VehicleCheckupBooking.findByIdAndUpdate(
      id,
      {
        inspectionReport: {
          findings: findings || [],
          recommendations: recommendations || "",
          reportUrl: reportUrl || "",
          completedAt: new Date(),
        },
        status: "report-generated",
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    return res.json({ success: true, data: booking });
  } catch (err) {
    console.error("updateInspectionReport", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// controllers/bookingController.js
import Booking from "../models/Booking.js";
import CleaningService from "../models/CleaningService.js";
import mongoose from "mongoose";

// POST /api/green/booking
export const createBooking = async (req, res) => {
  try {
    // expect userId from auth middleware, or pass userId in payload for now
    const userId = req.user?.id || req.body.userId;
    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const { cartItems, address, scheduledAt, branchId, notes, payment } =
      req.body;
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Cart items required" });
    }

    // compute totals
    let total = 0;
    for (const it of cartItems) {
      total += (it.price || 0) * (it.quantity || 1);
      if (it.addons) total += it.addons.reduce((s, a) => s + (a.price || 0), 0);
    }
    // optionally calculate taxes, discounts here
    const payable = total; // adjust as needed

    const booking = await Booking.create({
      userId,
      cartItems,
      totalAmount: total,
      payableAmount: payable,
      currency: "INR",
      address,
      scheduledAt,
      branchId,
      notes,
      payment: {
        status: payment?.status || "pending",
        method: payment?.method,
      },
    });

    return res.status(201).json({ success: true, data: booking });
  } catch (err) {
    console.error("createBooking", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/green/booking/:id
export const getBooking = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ success: false, message: "Invalid id" });
    const booking = await Booking.findById(id)
      .populate("cartItems.serviceId")
      .lean();
    if (!booking)
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    return res.json({ success: true, data: booking });
  } catch (err) {
    console.error("getBooking", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ADMIN: GET /api/green/admin/bookings
export const listBookingsAdmin = async (req, res) => {
  try {
    // admin check required
    const { page = 1, limit = 30, status } = req.query;
    const filter = {};
    if (status) filter.status = status;
    const skip = (Number(page) - 1) * Number(limit);
    const bookings = await Booking.find(filter)
      .sort("-createdAt")
      .skip(skip)
      .limit(Number(limit))
      .lean();
    const total = await Booking.countDocuments(filter);
    return res.json({
      success: true,
      data: bookings,
      meta: { total, page: Number(page), limit: Number(limit) },
    });
  } catch (err) {
    console.error("listBookingsAdmin", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ADMIN: PUT /api/green/admin/bookings/:id/status
export const updateBookingStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { status, providerId } = req.body;
    const updated = await Booking.findByIdAndUpdate(
      id,
      { status, providerId, updatedAt: new Date() },
      { new: true }
    );
    if (!updated)
      return res.status(404).json({ success: false, message: "Not found" });
    return res.json({ success: true, data: updated });
  } catch (err) {
    console.error("updateBookingStatus", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// routes/vehicleCheckup.js
import express from "express";
import {
  createVehicleCheckupBooking,
  getVehicleCheckupBooking,
  getUserVehicleCheckupBookings,
  listVehicleCheckupBookingsAdmin,
  updateVehicleCheckupBookingStatus,
  assignEmployeeToCheckup,
  updateInspectionReport,
} from "../controllers/vehicleCheckupController.js";

const router = express.Router();

// Public/User routes
router.post("/booking", createVehicleCheckupBooking);
router.get("/booking/:id", getVehicleCheckupBooking);
router.get("/bookings", getUserVehicleCheckupBookings);

// Admin routes
router.get("/admin/bookings", listVehicleCheckupBookingsAdmin);
router.put("/admin/bookings/:id/status", updateVehicleCheckupBookingStatus);
router.put("/admin/bookings/:id/assign", assignEmployeeToCheckup);

// Employee/Admin routes
router.put("/bookings/:id/report", updateInspectionReport);

export default router;

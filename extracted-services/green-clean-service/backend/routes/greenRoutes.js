// routes/greenRoutes.js
import express from "express";
import * as cleaningCtrl from "../controllers/cleaningServiceController.js";
import * as bookingCtrl from "../controllers/bookingController.js";
import { isAuth, isAdmin } from "../middleware/auth.js"; // implement these

const router = express.Router();

// Public services
router.get("/services", cleaningCtrl.listServices);
router.get("/services/:idOrSlug", cleaningCtrl.getService);

// Admin service management
router.post("/services", isAuth, isAdmin, cleaningCtrl.createService);
router.put("/services/:id", isAuth, isAdmin, cleaningCtrl.updateService);
router.delete("/services/:id", isAuth, isAdmin, cleaningCtrl.deleteService);

// Bookings (checkout)
router.post("/booking", isAuth, bookingCtrl.createBooking);
router.get("/booking/:id", isAuth, bookingCtrl.getBooking);

// Admin bookings and stats
router.get("/admin/bookings", isAuth, isAdmin, bookingCtrl.listBookingsAdmin);
router.put(
  "/admin/bookings/:id/status",
  isAuth,
  isAdmin,
  bookingCtrl.updateBookingStatus
);

// Admin stats (simple)
router.get("/admin/stats", isAuth, isAdmin, async (req, res) => {
  try {
    const totalServices = await (
      await import("../models/CleaningService.js")
    ).default.countDocuments();
    const totalBookings = await (
      await import("../models/Booking.js")
    ).default.countDocuments();
    return res.json({ success: true, data: { totalServices, totalBookings } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;

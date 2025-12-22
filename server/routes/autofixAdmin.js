import express from 'express';
import {
  getAllBookings,
  getBookingById,
  approvePrice,
  assignTechnician,
  updateStatus,
  updateAdminNotes,
  getStats,
  deleteBooking
} from '../controllers/autofixAdminController.js';
import { authenticateAdmin } from '../middleware/authAdmin.js';

const router = express.Router();

// All routes require admin authentication
router.use(authenticateAdmin);

// Booking management
router.get('/bookings', getAllBookings);
router.get('/booking/:id', getBookingById);
router.patch('/booking/:id/approve-price', approvePrice);
router.patch('/booking/:id/assign', assignTechnician);
router.patch('/booking/:id/status', updateStatus);
router.patch('/booking/:id/notes', updateAdminNotes);
router.delete('/booking/:id', deleteBooking);

// Statistics
router.get('/stats', getStats);

export default router;

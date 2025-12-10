import express from 'express';
import {
  getPriceQuote,
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
  addReview
} from '../controllers/keyServiceController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public route - Get price quote
router.post('/quote', getPriceQuote);

// Protected routes - Require authentication
router.post('/booking', authenticateToken, createBooking);
router.get('/my-bookings', authenticateToken, getUserBookings);
router.get('/booking/:id', authenticateToken, getBookingById);
router.patch('/booking/:id/cancel', authenticateToken, cancelBooking);
router.post('/booking/:id/review', authenticateToken, addReview);

export default router;

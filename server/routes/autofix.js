import express from 'express';
import {
  getPricing,
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
  addReview,
  getCarCategories,
  checkFirstTimeUser
} from '../controllers/autofixController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/pricing', getPricing);
router.get('/car-categories', getCarCategories);

// Protected routes - Require authentication
router.post('/booking', authenticateToken, createBooking);
router.get('/my-bookings', authenticateToken, getUserBookings);
router.get('/booking/:id', authenticateToken, getBookingById);
router.patch('/booking/:id/cancel', authenticateToken, cancelBooking);
router.post('/booking/:id/review', authenticateToken, addReview);
router.get('/check-first-time', authenticateToken, checkFirstTimeUser);

export default router;

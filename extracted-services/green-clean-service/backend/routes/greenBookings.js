import express from 'express';
import {
  createGreenBooking,
  verifyGreenPayment,
  getGreenBooking,
  getGreenBookingsByPhone,
  updateGreenBookingStatus
} from '../controllers/greenBookingController.js';
import { authenticateToken } from '../middleware/auth.js';
import { authenticateAdmin } from '../middleware/authAdmin.js';

const router = express.Router();

// Public/User routes (optionally authenticated)
router.post('/', createGreenBooking); // Can work with or without auth
router.post('/:id/pay', verifyGreenPayment);
router.get('/:id', getGreenBooking);
router.get('/phone/:phone', getGreenBookingsByPhone);

// Admin/Provider routes
router.put('/:id/status', authenticateAdmin, updateGreenBookingStatus);

export default router;

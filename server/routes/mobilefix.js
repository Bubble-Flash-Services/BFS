import express from 'express';
import {
  getPhoneBrands,
  getModelsByBrand,
  getPricing,
  getAllPricingForModel,
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
  addReview,
  checkFirstTimeUser
} from '../controllers/mobilefixController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/brands', getPhoneBrands);
router.get('/brands/:brandId/models', getModelsByBrand);
router.get('/pricing', getPricing);
router.get('/pricing/model/:modelId', getAllPricingForModel);

router.post('/booking', authenticateToken, createBooking);
router.get('/my-bookings', authenticateToken, getUserBookings);
router.get('/booking/:id', authenticateToken, getBookingById);
router.patch('/booking/:id/cancel', authenticateToken, cancelBooking);
router.post('/booking/:id/review', authenticateToken, addReview);
router.get('/check-first-time', authenticateToken, checkFirstTimeUser);

export default router;

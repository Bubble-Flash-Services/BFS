import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  handlePaymentFailure,
  getPaymentStatus,
  handleRazorpayWebhook
} from '../controllers/paymentController.js';

const router = express.Router();

// Webhook route (no auth required)
router.post('/webhook/razorpay', handleRazorpayWebhook);

// Protected routes
router.use(authenticateToken);

// Create Razorpay order
router.post('/create-order', createRazorpayOrder);

// Verify payment
router.post('/verify', verifyRazorpayPayment);

// Handle payment failure
router.post('/failure', handlePaymentFailure);

// Get payment status
router.get('/status/:orderId', getPaymentStatus);

export default router;

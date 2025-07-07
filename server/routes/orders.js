import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  submitOrderReview,
  updatePaymentStatus
} from '../controllers/orderController.js';

const router = express.Router();

// All order routes require authentication
router.use(authenticateToken);

// POST /api/orders - Create new order
router.post('/', createOrder);

// GET /api/orders - Get user orders
router.get('/', getUserOrders);

// GET /api/orders/:orderId - Get order by ID
router.get('/:orderId', getOrderById);

// PUT /api/orders/:orderId/cancel - Cancel order
router.put('/:orderId/cancel', cancelOrder);

// POST /api/orders/:orderId/review - Submit order review
router.post('/:orderId/review', submitOrderReview);

// PUT /api/orders/:orderId/payment - Update payment status (for webhooks)
router.put('/:orderId/payment', updatePaymentStatus);

export default router;

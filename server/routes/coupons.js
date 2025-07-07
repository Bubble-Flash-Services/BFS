import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  getAvailableCoupons,
  validateCoupon,
  applyCoupon,
  getCouponByCode
} from '../controllers/couponController.js';

const router = express.Router();

// Protected routes first
router.use(authenticateToken);

// GET /api/coupons - Get available coupons for user
router.get('/', getAvailableCoupons);

// POST /api/coupons/validate - Validate coupon
router.post('/validate', validateCoupon);

// POST /api/coupons/apply - Apply coupon
router.post('/apply', applyCoupon);

// Public routes (no auth required, put at end to avoid conflicts)
router.get('/public/:code', getCouponByCode);

export default router;

import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from '../controllers/cartController.js';

const router = express.Router();

// All cart routes require authentication
router.use(authenticateToken);

// GET /api/cart - Get user cart
router.get('/', getCart);

// POST /api/cart - Add item to cart
router.post('/', addToCart);

// PUT /api/cart/:itemId - Update cart item
router.put('/:itemId', updateCartItem);

// DELETE /api/cart/:itemId - Remove cart item
router.delete('/:itemId', removeFromCart);

// DELETE /api/cart - Clear cart
router.delete('/', clearCart);

export default router;

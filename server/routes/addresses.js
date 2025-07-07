import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  getUserAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getAddressById
} from '../controllers/addressController.js';

const router = express.Router();

// All address routes require authentication
router.use(authenticateToken);

// GET /api/addresses - Get user addresses
router.get('/', getUserAddresses);

// POST /api/addresses - Add new address
router.post('/', addAddress);

// GET /api/addresses/:addressId - Get address by ID
router.get('/:addressId', getAddressById);

// PUT /api/addresses/:addressId - Update address
router.put('/:addressId', updateAddress);

// DELETE /api/addresses/:addressId - Delete address
router.delete('/:addressId', deleteAddress);

// PUT /api/addresses/:addressId/default - Set default address
router.put('/:addressId/default', setDefaultAddress);

export default router;

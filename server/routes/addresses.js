import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { bangalorePincodes } from '../utils/bangalorePincodes.js';
import {
  getUserAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getAddressById,
  reverseGeocode,
  searchAddresses,
  getAddressSuggestions
} from '../controllers/addressController.js';

const router = express.Router();

// Public routes (no authentication required)
router.post('/reverse-geocode', reverseGeocode);
router.get('/search', searchAddresses);
router.get('/suggestions', getAddressSuggestions);
// Public: Check service availability by pincode
router.post('/check-service', (req, res) => {
  try {
    const { pincode } = req.body || {};
    console.log('check-service pincode:', pincode);
    if (!pincode || !/^\d{6}$/.test(pincode)) {
      return res.status(400).json({
        success: false,
        available: false,
        message: 'Valid 6-digit pincode is required'
      });
    }

    if (process.env.DEV_MODE === 'true') {
      return res.json({ success: true, available: true });
    }

    const available = bangalorePincodes.includes(pincode);
    if (!available) {
      return res.status(400).json({
        success: false,
        available: false,
        message: 'We currently serve only Bangalore areas — coming soon to your area!'
      });
    }
    return res.json({ success: true, available: true });
  } catch (err) {
    console.error('check-service error:', err);
    return res.status(500).json({ success: false, available: false, message: 'Internal error' });
  }
});

// All other address routes require authentication
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

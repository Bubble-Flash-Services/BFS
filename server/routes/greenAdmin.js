import express from 'express';
import {
  getAllGreenBookings,
  assignProviderToBooking,
  getGreenStats,
  getAllBranches,
  createBranch,
  updateBranch
} from '../controllers/greenAdminController.js';
import { authenticateAdmin } from '../middleware/authAdmin.js';

const router = express.Router();

// All routes require admin authentication
router.use(authenticateAdmin);

// Booking management
router.get('/bookings', getAllGreenBookings);
router.post('/assign', assignProviderToBooking);

// Statistics
router.get('/stats', getGreenStats);

// Branch management
router.get('/branches', getAllBranches);
router.post('/branches', createBranch);
router.put('/branches/:id', updateBranch);

export default router;

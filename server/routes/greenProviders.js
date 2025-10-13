import express from 'express';
import {
  getNearbyProviders,
  acceptAssignment,
  updateProviderStatus,
  getAllProviders,
  createProvider
} from '../controllers/greenProviderController.js';
import { authenticateAdmin } from '../middleware/authAdmin.js';

const router = express.Router();

// Public routes
router.get('/nearby', getNearbyProviders);

// Provider routes (in production, use provider authentication)
router.post('/:id/accept', acceptAssignment);
router.put('/:id/status', updateProviderStatus);

// Admin routes
router.get('/', authenticateAdmin, getAllProviders);
router.post('/', authenticateAdmin, createProvider);

export default router;

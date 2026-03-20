import express from 'express';
import {
  getGreenServices,
  getGreenServiceById,
  createGreenService,
  updateGreenService,
  deleteGreenService
} from '../controllers/greenServiceController.js';
import { authenticateAdmin } from '../middleware/authAdmin.js';

const router = express.Router();

// Public routes
router.get('/', getGreenServices);
router.get('/:id', getGreenServiceById);

// Admin routes
router.post('/', authenticateAdmin, createGreenService);
router.put('/:id', authenticateAdmin, updateGreenService);
router.delete('/:id', authenticateAdmin, deleteGreenService);

export default router;

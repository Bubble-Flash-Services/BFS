import express from 'express';
import {
  getMoversPackersServices,
  getMoversPackersServiceById,
  getServicesByItemType,
  calculatePrice
} from '../controllers/moversPackersController.js';

const router = express.Router();

// Public routes - no authentication required

// GET /api/movers-packers - Get all movers & packers services
router.get('/', getMoversPackersServices);

// GET /api/movers-packers/item-type/:itemType - Get services by item type
router.get('/item-type/:itemType', getServicesByItemType);

// POST /api/movers-packers/calculate-price - Calculate price based on distance
router.post('/calculate-price', calculatePrice);

// GET /api/movers-packers/:id - Get service by ID
router.get('/:id', getMoversPackersServiceById);

export default router;

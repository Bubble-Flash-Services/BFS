import express from 'express';
import {
  getServiceCategories,
  getServicesByCategory,
  getAllServices,
  getServiceById,
  getPackagesByService,
  getAllPackages,
  getPackageById,
  getAddOns,
  getAddOnById,
  searchServices
} from '../controllers/serviceController.js';

const router = express.Router();

// Public routes - no authentication required

// GET /api/services/categories - Get all service categories
router.get('/categories', getServiceCategories);

// GET /api/services/search - Search services and packages
router.get('/search', searchServices);

// GET /api/services/category/:categoryId - Get services by category
router.get('/category/:categoryId', getServicesByCategory);

// Package routes
// GET /api/services/packages/all - Get all packages
router.get('/packages/all', getAllPackages);

// GET /api/services/packages/:packageId - Get package by ID
router.get('/packages/:packageId', getPackageById);

// Add-on routes
// GET /api/services/addons - Get all add-ons
router.get('/addons', getAddOns);

// GET /api/services/addons/:addOnId - Get add-on by ID
router.get('/addons/:addOnId', getAddOnById);

// GET /api/services - Get all services
router.get('/', getAllServices);

// GET /api/services/:serviceId - Get service by ID
router.get('/:serviceId', getServiceById);

// GET /api/services/:serviceId/packages - Get packages by service
router.get('/:serviceId/packages', getPackagesByService);

export default router;

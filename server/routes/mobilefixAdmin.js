import express from 'express';
import {
  getAllBookings,
  getBookingById,
  assignTechnician,
  updateStatus,
  updateAdminNotes,
  deleteBooking,
  getStats,
  getAllBrands,
  createBrand,
  updateBrand,
  deleteBrand,
  getModelsByBrand,
  getAllModels,
  createModel,
  updateModel,
  deleteModel,
  getPricingByModel,
  getAllPricing,
  createPricing,
  updatePricing,
  deletePricing
} from '../controllers/mobilefixAdminController.js';
import { authenticateAdmin } from '../middleware/authAdmin.js';

const router = express.Router();

router.use(authenticateAdmin);

router.get('/bookings', getAllBookings);
router.get('/booking/:id', getBookingById);
router.patch('/booking/:id/assign', assignTechnician);
router.patch('/booking/:id/status', updateStatus);
router.patch('/booking/:id/notes', updateAdminNotes);
router.delete('/booking/:id', deleteBooking);

router.get('/stats', getStats);

router.get('/brands', getAllBrands);
router.post('/brands', createBrand);
router.patch('/brands/:id', updateBrand);
router.delete('/brands/:id', deleteBrand);

router.get('/brands/:brandId/models', getModelsByBrand);
router.get('/models', getAllModels);
router.post('/models', createModel);
router.patch('/models/:id', updateModel);
router.delete('/models/:id', deleteModel);

router.get('/pricing/model/:modelId', getPricingByModel);
router.get('/pricing', getAllPricing);
router.post('/pricing', createPricing);
router.patch('/pricing/:id', updatePricing);
router.delete('/pricing/:id', deletePricing);

export default router;

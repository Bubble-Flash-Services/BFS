import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import {
  getDashboardStats,
  createServiceCategory,
  updateServiceCategory,
  deleteServiceCategory,
  createService,
  updateService,
  deleteService,
  createPackage,
  updatePackage,
  deletePackage,
  getAllOrders,
  updateOrderStatus,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getAllCoupons,
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee
} from '../controllers/adminController.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// Dashboard
router.get('/dashboard/stats', getDashboardStats);

// Service Categories Management
router.post('/categories', createServiceCategory);
router.put('/categories/:categoryId', updateServiceCategory);
router.delete('/categories/:categoryId', deleteServiceCategory);

// Services Management
router.post('/services', createService);
router.put('/services/:serviceId', updateService);
router.delete('/services/:serviceId', deleteService);

// Packages Management
router.post('/packages', createPackage);
router.put('/packages/:packageId', updatePackage);
router.delete('/packages/:packageId', deletePackage);

// Orders Management
router.get('/orders', getAllOrders);
router.put('/orders/:orderId/status', updateOrderStatus);

// Coupons Management
router.get('/coupons', getAllCoupons);
router.post('/coupons', createCoupon);
router.put('/coupons/:couponId', updateCoupon);
router.delete('/coupons/:couponId', deleteCoupon);

// Employee Management
router.get('/employees', getAllEmployees);
router.post('/employees', createEmployee);
router.put('/employees/:employeeId', updateEmployee);
router.delete('/employees/:employeeId', deleteEmployee);

export default router;

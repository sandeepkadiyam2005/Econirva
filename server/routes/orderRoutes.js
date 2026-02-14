import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as orderController from '../controllers/orderController.js';
import { authenticate } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/roles.js';
import { requireFields } from '../middleware/validate.js';
import { upload } from '../utils/upload.js';

const router = Router();

router.post(
  '/',
  authenticate,
  authorizeRoles('ADMIN', 'SALES', 'MANAGER'),
  upload.single('logo'),
  requireFields(['customerName', 'customerEmail', 'items']),
  asyncHandler(orderController.createOrder)
);
router.get('/', authenticate, authorizeRoles('ADMIN', 'SALES', 'MANAGER', 'STAFF'), asyncHandler(orderController.getOrders));
router.get('/:id', authenticate, authorizeRoles('ADMIN', 'SALES', 'MANAGER', 'STAFF'), asyncHandler(orderController.getOrderById));
router.put(
  '/:id/status',
  authenticate,
  authorizeRoles('ADMIN', 'SALES', 'MANAGER'),
  requireFields(['status']),
  asyncHandler(orderController.updateOrderStatus)
);

export default router;

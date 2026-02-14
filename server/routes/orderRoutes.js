import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as orderController from '../controllers/orderController.js';
import { authenticate } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/roles.js';
import { requireFields } from '../middleware/validate.js';
import { upload } from '../utils/upload.js';
import { requireFeature } from '../middleware/featureAccess.js';
import { trackUsage } from '../middleware/usageTracker.js';
import { writeAuditLog } from '../middleware/auditLog.js';

const router = Router();

router.post(
  '/',
  authenticate,
  authorizeRoles('TENANT_ADMIN', 'SALES_MANAGER', 'OPERATIONS_MANAGER'),
  requireFeature('core.orders'),
  upload.single('logo'),
  requireFields(['customerName', 'customerEmail', 'items']),
  trackUsage('orders.created'),
  writeAuditLog('CREATE', 'ORDER'),
  asyncHandler(orderController.createOrder)
);
router.get(
  '/',
  authenticate,
  requireFeature('core.orders'),
  trackUsage('orders.read'),
  asyncHandler(orderController.getOrders)
);
router.get(
  '/:id',
  authenticate,
  requireFeature('core.orders'),
  trackUsage('orders.read.by_id'),
  asyncHandler(orderController.getOrderById)
);
router.put(
  '/:id/status',
  authenticate,
  authorizeRoles('TENANT_ADMIN', 'SALES_MANAGER', 'OPERATIONS_MANAGER'),
  requireFeature('core.orders'),
  requireFields(['status']),
  trackUsage('orders.status.updated'),
  writeAuditLog('UPDATE', 'ORDER_STATUS'),
  asyncHandler(orderController.updateOrderStatus)
);

export default router;

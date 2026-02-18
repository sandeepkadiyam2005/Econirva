import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as productController from '../controllers/productController.js';
import { authenticate } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/roles.js';
import { requireFields } from '../middleware/validate.js';
import { requireFeature } from '../middleware/featureAccess.js';
import { trackUsage } from '../middleware/usageTracker.js';

const router = Router();

router.get('/', authenticate, trackUsage('products.read'), asyncHandler(productController.getProducts));
router.get('/:id', authenticate, trackUsage('products.read.by_id'), asyncHandler(productController.getProductById));
router.post(
  '/',
  authenticate,
  authorizeRoles('TENANT_ADMIN', 'OPERATIONS_MANAGER'),
  requireFeature('core.inventory'),
  requireFields(['name', 'price']),
  trackUsage('products.created'),
  asyncHandler(productController.createProduct)
);
router.put(
  '/:id',
  authenticate,
  authorizeRoles('TENANT_ADMIN', 'OPERATIONS_MANAGER'),
  requireFeature('core.inventory'),
  trackUsage('products.updated'),
  asyncHandler(productController.updateProduct)
);
router.delete(
  '/:id',
  authenticate,
  authorizeRoles('TENANT_ADMIN'),
  requireFeature('core.inventory'),
  trackUsage('products.deleted'),
  asyncHandler(productController.deleteProduct)
);

export default router;

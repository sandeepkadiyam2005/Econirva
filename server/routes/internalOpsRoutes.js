import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as internalOpsController from '../controllers/internalOpsController.js';
import { authenticate } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/roles.js';

const router = Router();

router.get('/orders', authenticate, authorizeRoles('SUPER_ADMIN', 'SALES', 'ORDER_HANDLER', 'FINANCE'), asyncHandler(internalOpsController.getOrdersModule));
router.get('/production', authenticate, authorizeRoles('SUPER_ADMIN', 'PRODUCTION'), asyncHandler(internalOpsController.getProductionOverview));
router.get('/inventory', authenticate, authorizeRoles('SUPER_ADMIN', 'PRODUCTION', 'ORDER_HANDLER'), asyncHandler(internalOpsController.getInventoryOverview));
router.get('/finance', authenticate, authorizeRoles('SUPER_ADMIN', 'FINANCE'), asyncHandler(internalOpsController.getFinanceOverview));

export default router;

import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as customerController from '../controllers/customerController.js';
import { authenticate } from '../middleware/auth.js';
import { requireFeature } from '../middleware/featureAccess.js';

const router = Router();

router.get('/', authenticate, requireFeature('core.erp'), asyncHandler(customerController.getCustomers));
router.get('/:id', authenticate, requireFeature('core.erp'), asyncHandler(customerController.getCustomerById));

export default router;

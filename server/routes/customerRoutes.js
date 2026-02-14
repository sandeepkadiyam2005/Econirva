import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as customerController from '../controllers/customerController.js';
import { authenticate } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/roles.js';

const router = Router();

router.get('/', authenticate, authorizeRoles('ADMIN', 'SALES', 'MANAGER', 'STAFF'), asyncHandler(customerController.getCustomers));
router.get('/:id', authenticate, authorizeRoles('ADMIN', 'SALES', 'MANAGER', 'STAFF'), asyncHandler(customerController.getCustomerById));

export default router;

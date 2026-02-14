import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as productController from '../controllers/productController.js';
import { authenticate } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/roles.js';
import { requireFields } from '../middleware/validate.js';

const router = Router();

router.get('/', asyncHandler(productController.getProducts));
router.get('/:id', asyncHandler(productController.getProductById));
router.post(
  '/',
  authenticate,
  authorizeRoles('ADMIN', 'MANAGER'),
  requireFields(['name', 'price']),
  asyncHandler(productController.createProduct)
);
router.put('/:id', authenticate, authorizeRoles('ADMIN', 'MANAGER'), asyncHandler(productController.updateProduct));
router.delete('/:id', authenticate, authorizeRoles('ADMIN'), asyncHandler(productController.deleteProduct));

export default router;

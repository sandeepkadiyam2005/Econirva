import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as authController from '../controllers/authController.js';
import { requireFields } from '../middleware/validate.js';

const router = Router();

router.post('/signup', requireFields(['name', 'email', 'password']), asyncHandler(authController.signup));
router.post('/login', requireFields(['email', 'password']), asyncHandler(authController.login));

export default router;

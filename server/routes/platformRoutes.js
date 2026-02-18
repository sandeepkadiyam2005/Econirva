import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as platformController from '../controllers/platformController.js';
import { authenticate } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/roles.js';
import { requireFeature } from '../middleware/featureAccess.js';
import { requireFields } from '../middleware/validate.js';

const router = Router();

router.get('/plans', asyncHandler(platformController.getPlans));
router.post('/tenants', requireFields(['name', 'slug', 'subdomain', 'plan']), asyncHandler(platformController.createTenant));

router.get('/tenant/context', authenticate, asyncHandler(platformController.getTenantContext));

router.get('/localization/options', authenticate, asyncHandler(platformController.getLocalizationOptions));
router.post('/tax/estimate', authenticate, requireFields(['countryCode', 'regionCode', 'currency', 'baseAmount']), asyncHandler(platformController.estimateTax));

router.get('/billing/invoices', authenticate, authorizeRoles('TENANT_ADMIN', 'FINANCE_MANAGER'), asyncHandler(platformController.listInvoices));
router.post(
  '/billing/invoices',
  authenticate,
  authorizeRoles('TENANT_ADMIN', 'FINANCE_MANAGER'),
  requireFields(['amount', 'currency']),
  asyncHandler(platformController.createInvoice)
);

router.post(
  '/traceability/material-batches',
  authenticate,
  requireFeature('traceability.blockchain'),
  authorizeRoles('TENANT_ADMIN', 'OPERATIONS_MANAGER'),
  requireFields(['batchCode', 'originCountry', 'supplierName']),
  asyncHandler(platformController.createMaterialBatch)
);
router.post(
  '/traceability/certificates',
  authenticate,
  requireFeature('traceability.blockchain'),
  authorizeRoles('TENANT_ADMIN', 'OPERATIONS_MANAGER'),
  requireFields(['certificateNo', 'standard', 'issuedBy']),
  asyncHandler(platformController.issueCertificate)
);

router.get('/esg/dashboard', authenticate, requireFeature('analytics.esg'), asyncHandler(platformController.getEsgDashboard));
router.get('/investor/dashboard', authenticate, requireFeature('analytics.esg'), asyncHandler(platformController.getInvestorDashboard));
router.post('/ai/forecast', authenticate, requireFeature('ai.forecasting'), requireFields(['forecastType']), asyncHandler(platformController.createForecast));

export default router;

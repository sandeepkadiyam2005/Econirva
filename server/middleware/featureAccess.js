import { prisma } from '../config/database.js';

export const requireFeature = (featureKey) => async (req, _res, next) => {
  if (!req.tenant?.id) {
    return next({ status: 400, message: 'Tenant context required for feature checks.' });
  }

  const feature = await prisma.tenantFeature.findUnique({
    where: {
      tenantId_key: {
        tenantId: req.tenant.id,
        key: featureKey,
      },
    },
  });

  if (!feature?.enabled) {
    return next({ status: 403, message: `Feature '${featureKey}' is not enabled for this subscription.` });
  }

  req.feature = feature;
  return next();
};

import { prisma } from '../config/database.js';

export const trackUsage = (metricKey, metricValue = 1) => async (req, _res, next) => {
  if (!req.tenant?.id) return next();

  const now = new Date();
  const windowStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const windowEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));

  await prisma.usageMetric.create({
    data: {
      tenantId: req.tenant.id,
      metricKey,
      metricValue,
      windowStart,
      windowEnd,
    },
  });

  return next();
};

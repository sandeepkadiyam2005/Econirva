import { prisma } from '../config/database.js';

export const writeAuditLog = (action, resource) => async (req, _res, next) => {
  if (!req.tenant?.id) return next();

  await prisma.auditLog.create({
    data: {
      tenantId: req.tenant.id,
      userId: req.user?.sub,
      action,
      resource,
      metadata: {
        method: req.method,
        path: req.path,
      },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    },
  });

  return next();
};

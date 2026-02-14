import { prisma } from '../config/database.js';

const platformHosts = new Set(['localhost', '127.0.0.1']);

const extractSubdomain = (host = '') => {
  const cleanHost = host.split(':')[0].toLowerCase();
  if (!cleanHost || platformHosts.has(cleanHost)) return null;
  const parts = cleanHost.split('.');
  if (parts.length < 3) return null;
  return parts[0];
};

export const resolveTenant = async (req, _res, next) => {
  const tenantHint = req.headers['x-tenant-id'] || req.headers['x-tenant-slug'] || extractSubdomain(req.headers.host);

  if (!tenantHint) {
    return next({ status: 400, message: 'Tenant context missing. Use subdomain or x-tenant-id header.' });
  }

  const tenant = await prisma.tenant.findFirst({
    where:
      typeof tenantHint === 'string'
        ? { OR: [{ id: tenantHint }, { slug: tenantHint }, { subdomain: tenantHint }] }
        : undefined,
    include: {
      subscriptions: {
        where: { status: { in: ['TRIAL', 'ACTIVE'] } },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  });

  if (!tenant) {
    return next({ status: 404, message: 'Tenant not found.' });
  }

  req.tenant = tenant;
  return next();
};

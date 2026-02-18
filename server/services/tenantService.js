import { prisma } from '../config/database.js';

const PLAN_CONFIG = {
  BASIC: { maxUsers: 25, maxOrdersPerMonth: 2000, features: ['core.erp', 'core.orders', 'core.inventory'] },
  PRO: {
    maxUsers: 200,
    maxOrdersPerMonth: 25000,
    features: ['core.erp', 'core.orders', 'core.inventory', 'analytics.esg', 'ai.forecasting'],
  },
  ENTERPRISE: {
    maxUsers: 2000,
    maxOrdersPerMonth: 250000,
    features: [
      'core.erp',
      'core.orders',
      'core.inventory',
      'analytics.esg',
      'ai.forecasting',
      'traceability.blockchain',
      'security.sso',
      'platform.whitelabel',
    ],
  },
};

export const getPlans = () => PLAN_CONFIG;

export const createTenant = async ({ name, slug, subdomain, plan = 'BASIC', adminUser }) => {
  const config = PLAN_CONFIG[plan] || PLAN_CONFIG.BASIC;

  return prisma.$transaction(async (tx) => {
    const tenant = await tx.tenant.create({
      data: {
        name,
        slug,
        subdomain,
      },
    });

    await tx.tenantSubscription.create({
      data: {
        tenantId: tenant.id,
        plan,
        status: 'TRIAL',
        maxUsers: config.maxUsers,
        maxOrdersPerMonth: config.maxOrdersPerMonth,
      },
    });

    if (adminUser) {
      await tx.user.create({
        data: {
          tenantId: tenant.id,
          name: adminUser.name,
          email: adminUser.email,
          password: adminUser.password,
          role: 'TENANT_ADMIN',
        },
      });
    }

    if (config.features.length > 0) {
      await tx.tenantFeature.createMany({
        data: config.features.map((featureKey) => ({
          tenantId: tenant.id,
          key: featureKey,
          enabled: true,
        })),
      });
    }

    return tenant;
  });
};

export const getTenantContext = async (tenantId) => {
  const [tenant, subscription, features] = await Promise.all([
    prisma.tenant.findUnique({ where: { id: tenantId } }),
    prisma.tenantSubscription.findFirst({ where: { tenantId }, orderBy: { createdAt: 'desc' } }),
    prisma.tenantFeature.findMany({ where: { tenantId } }),
  ]);

  return { tenant, subscription, features };
};

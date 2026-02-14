import { prisma } from '../config/database.js';

export const getEsgDashboard = async (tenantId) => {
  const [latestCarbon, reports] = await Promise.all([
    prisma.carbonMetric.findFirst({ where: { tenantId }, orderBy: [{ periodYear: 'desc' }, { periodMonth: 'desc' }] }),
    prisma.esgReport.findMany({ where: { tenantId }, orderBy: { createdAt: 'desc' }, take: 10 }),
  ]);

  return {
    carbon: latestCarbon,
    reports,
  };
};

export const getInvestorDashboard = async (tenantId) => {
  const metrics = await prisma.investorMetric.findMany({ where: { tenantId }, orderBy: { createdAt: 'asc' }, take: 24 });
  const revenue = metrics.reduce((sum, item) => sum + Number(item.revenue), 0);
  const latest = metrics.at(-1);

  return {
    series: metrics,
    summary: {
      totalRevenue: revenue,
      latestBurnRate: latest?.burnRate || null,
      latestActiveUsers: latest?.activeUsers || 0,
      latestGrowthRatePct: latest?.growthRatePct || null,
    },
  };
};

import { prisma } from '../config/database.js';

export const getOrdersModule = async (tenantId, deliveredFilter = 'all') => {
  const where = { tenantId };
  if (deliveredFilter === 'delivered') where.status = 'DELIVERED';
  if (deliveredFilter === 'pending') where.status = { not: 'DELIVERED' };

  return prisma.order.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      orderItems: true,
    },
    take: 100,
  });
};

export const getProductionOverview = async (tenantId) => {
  const [totalBatches, recentBatches, openOrders] = await Promise.all([
    prisma.materialBatch.count({ where: { tenantId } }),
    prisma.materialBatch.findMany({ where: { tenantId }, orderBy: { createdAt: 'desc' }, take: 5 }),
    prisma.order.count({ where: { tenantId, status: { in: ['PENDING', 'APPROVED', 'PROCESSING'] } } }),
  ]);

  return { totalBatches, openOrders, recentBatches };
};

export const getInventoryOverview = async (tenantId) => {
  const products = await prisma.product.findMany({ where: { tenantId }, orderBy: { stock: 'asc' }, take: 100 });
  const lowStock = products.filter((p) => p.stock <= 100);

  return {
    totalProducts: products.length,
    lowStockCount: lowStock.length,
    lowStock,
  };
};

export const getFinanceOverview = async (tenantId) => {
  const [orders, invoices] = await Promise.all([
    prisma.order.findMany({ where: { tenantId }, select: { totalPrice: true, createdAt: true } }),
    prisma.billingInvoice.findMany({ where: { tenantId }, select: { amount: true, status: true, currency: true, createdAt: true } }),
  ]);

  const revenue = orders.reduce((sum, o) => sum + Number(o.totalPrice), 0);
  const pendingInvoices = invoices.filter((i) => i.status !== 'PAID').length;

  return {
    totalRevenue: revenue,
    totalOrders: orders.length,
    invoiceCount: invoices.length,
    pendingInvoices,
    invoices,
  };
};

import { prisma } from '../config/database.js';

export const createInvoice = ({ tenantId, amount, currency, dueAt }) =>
  prisma.billingInvoice.create({
    data: {
      tenantId,
      amount: Number(amount),
      currency,
      status: 'ISSUED',
      issuedAt: new Date(),
      dueAt: dueAt ? new Date(dueAt) : null,
    },
  });

export const listInvoices = (tenantId) =>
  prisma.billingInvoice.findMany({
    where: { tenantId },
    orderBy: { createdAt: 'desc' },
  });

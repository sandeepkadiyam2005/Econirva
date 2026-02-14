import { prisma } from '../config/database.js';

export const getCustomers = (tenantId) => prisma.customer.findMany({ where: { tenantId }, orderBy: { name: 'asc' } });

export const getCustomerById = async (tenantId, id) => {
  const customer = await prisma.customer.findFirst({ where: { tenantId, id } });
  if (!customer) throw { status: 404, message: 'Customer not found.' };
  return customer;
};

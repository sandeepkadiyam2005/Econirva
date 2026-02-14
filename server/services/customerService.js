import { prisma } from '../config/database.js';

export const getCustomers = () => prisma.customer.findMany({ orderBy: { name: 'asc' } });

export const getCustomerById = async (id) => {
  const customer = await prisma.customer.findUnique({ where: { id } });
  if (!customer) throw { status: 404, message: 'Customer not found.' };
  return customer;
};

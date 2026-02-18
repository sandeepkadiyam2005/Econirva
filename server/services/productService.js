import { prisma } from '../config/database.js';

export const getProducts = (tenantId) => prisma.product.findMany({ where: { tenantId }, orderBy: { createdAt: 'desc' } });

export const getProductById = async (tenantId, id) => {
  const product = await prisma.product.findFirst({ where: { tenantId, id } });
  if (!product) throw { status: 404, message: 'Product not found.' };
  return product;
};

export const createProduct = (tenantId, payload) =>
  prisma.product.create({
    data: {
      tenantId,
      ...payload,
      price: Number(payload.price),
      stock: Number(payload.stock || 0),
      currency: payload.currency || 'USD',
    },
  });

export const updateProduct = async (tenantId, id, payload) => {
  await getProductById(tenantId, id);
  return prisma.product.update({
    where: { id },
    data: {
      ...payload,
      price: payload.price !== undefined ? Number(payload.price) : undefined,
      stock: payload.stock !== undefined ? Number(payload.stock) : undefined,
    },
  });
};

export const deleteProduct = async (tenantId, id) => {
  await getProductById(tenantId, id);
  await prisma.product.delete({ where: { id } });
};

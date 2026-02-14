import { prisma } from '../config/database.js';

export const getProducts = () => prisma.product.findMany({ orderBy: { createdAt: 'desc' } });

export const getProductById = async (id) => {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw { status: 404, message: 'Product not found.' };
  return product;
};

export const createProduct = (payload) =>
  prisma.product.create({
    data: {
      ...payload,
      price: Number(payload.price),
      stock: Number(payload.stock || 0),
    },
  });

export const updateProduct = async (id, payload) => {
  await getProductById(id);
  return prisma.product.update({
    where: { id },
    data: {
      ...payload,
      price: payload.price !== undefined ? Number(payload.price) : undefined,
      stock: payload.stock !== undefined ? Number(payload.stock) : undefined,
    },
  });
};

export const deleteProduct = async (id) => {
  await getProductById(id);
  await prisma.product.delete({ where: { id } });
};

import { prisma } from '../config/database.js';
import { publishEvent } from './eventService.js';
import { uploadFile } from './storageService.js';

const toAbsoluteUrl = (req, url) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${req.protocol}://${req.get('host')}${url}`;
};

export const createOrder = async (req) => {
  const { customerName, customerEmail, customerId, items = [], currency = 'USD' } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    throw { status: 400, message: 'Order items are required.' };
  }

  const productIds = items.map((item) => item.productId);
  const products = await prisma.product.findMany({ where: { tenantId: req.tenant.id, id: { in: productIds } } });

  const productMap = new Map(products.map((product) => [product.id, product]));
  const missingProduct = items.find((item) => !productMap.has(item.productId));
  if (missingProduct) {
    throw { status: 400, message: `Product not found for item ${missingProduct.productId}.` };
  }

  const totalPrice = items.reduce((total, item) => {
    const product = productMap.get(item.productId);
    return total + Number(product.price) * Number(item.quantity);
  }, 0);

  const uploadResult = await uploadFile({ tenantId: req.tenant.id, file: req.file });

  const createdOrder = await prisma.order.create({
    data: {
      tenantId: req.tenant.id,
      customerId: customerId || null,
      customerName,
      customerEmail,
      totalPrice,
      currency,
      logoUrl: toAbsoluteUrl(req, uploadResult?.url),
      orderItems: {
        create: items.map((item) => ({
          productId: item.productId,
          quantity: Number(item.quantity),
        })),
      },
    },
    include: {
      orderItems: true,
    },
  });

  publishEvent('order.created', { tenantId: req.tenant.id, orderId: createdOrder.id });
  return createdOrder;
};

export const getOrders = (tenantId) =>
  prisma.order.findMany({
    where: { tenantId },
    include: {
      orderItems: {
        include: { product: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

export const getOrderById = async (tenantId, id) => {
  const order = await prisma.order.findFirst({
    where: { tenantId, id },
    include: {
      orderItems: {
        include: { product: true },
      },
    },
  });

  if (!order) throw { status: 404, message: 'Order not found.' };
  return order;
};

export const updateOrderStatus = async (tenantId, id, status) => {
  await getOrderById(tenantId, id);
  const updatedOrder = await prisma.order.update({
    where: { id },
    data: { status },
  });

  publishEvent('order.status.updated', { tenantId, orderId: id, status });
  return updatedOrder;
};

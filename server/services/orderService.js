import { prisma } from '../config/database.js';

const buildLogoUrl = (req, fileName) => `${req.protocol}://${req.get('host')}/uploads/${fileName}`;

export const createOrder = async (req) => {
  const { customerName, customerEmail, items = [] } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    throw { status: 400, message: 'Order items are required.' };
  }

  const productIds = items.map((item) => item.productId);
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });

  const productMap = new Map(products.map((product) => [product.id, product]));
  const missingProduct = items.find((item) => !productMap.has(item.productId));
  if (missingProduct) {
    throw { status: 400, message: `Product not found for item ${missingProduct.productId}.` };
  }

  const totalPrice = items.reduce((total, item) => {
    const product = productMap.get(item.productId);
    return total + Number(product.price) * Number(item.quantity);
  }, 0);

  return prisma.order.create({
    data: {
      customerName,
      customerEmail,
      totalPrice,
      logoUrl: req.file ? buildLogoUrl(req, req.file.filename) : null,
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
};

export const getOrders = () =>
  prisma.order.findMany({
    include: {
      orderItems: {
        include: { product: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

export const getOrderById = async (id) => {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      orderItems: {
        include: { product: true },
      },
    },
  });

  if (!order) throw { status: 404, message: 'Order not found.' };
  return order;
};

export const updateOrderStatus = async (id, status) => {
  await getOrderById(id);
  return prisma.order.update({
    where: { id },
    data: { status },
  });
};

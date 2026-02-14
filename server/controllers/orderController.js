import * as orderService from '../services/orderService.js';

export const createOrder = async (req, res) => {
  const order = await orderService.createOrder(req);
  res.status(201).json({ success: true, data: order });
};

export const getOrders = async (_req, res) => {
  const orders = await orderService.getOrders();
  res.status(200).json({ success: true, data: orders });
};

export const getOrderById = async (req, res) => {
  const order = await orderService.getOrderById(req.params.id);
  res.status(200).json({ success: true, data: order });
};

export const updateOrderStatus = async (req, res) => {
  const order = await orderService.updateOrderStatus(req.params.id, req.body.status);
  res.status(200).json({ success: true, data: order });
};

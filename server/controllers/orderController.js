import * as orderService from '../services/orderService.js';

export const createOrder = async (req, res) => {
  const order = await orderService.createOrder(req);
  res.status(201).json({ success: true, data: order });
};

export const getOrders = async (req, res) => {
  const orders = await orderService.getOrders(req.tenant.id);
  res.status(200).json({ success: true, data: orders });
};

export const getOrderById = async (req, res) => {
  const order = await orderService.getOrderById(req.tenant.id, req.params.id);
  res.status(200).json({ success: true, data: order });
};

export const updateOrderStatus = async (req, res) => {
  const order = await orderService.updateOrderStatus(req.tenant.id, req.params.id, req.body.status);
  res.status(200).json({ success: true, data: order });
};

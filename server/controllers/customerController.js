import * as customerService from '../services/customerService.js';

export const getCustomers = async (_req, res) => {
  const customers = await customerService.getCustomers();
  res.status(200).json({ success: true, data: customers });
};

export const getCustomerById = async (req, res) => {
  const customer = await customerService.getCustomerById(req.params.id);
  res.status(200).json({ success: true, data: customer });
};

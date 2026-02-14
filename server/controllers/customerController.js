import * as customerService from '../services/customerService.js';

export const getCustomers = async (req, res) => {
  const customers = await customerService.getCustomers(req.tenant.id);
  res.status(200).json({ success: true, data: customers });
};

export const getCustomerById = async (req, res) => {
  const customer = await customerService.getCustomerById(req.tenant.id, req.params.id);
  res.status(200).json({ success: true, data: customer });
};

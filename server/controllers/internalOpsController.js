import * as internalOpsService from '../services/internalOpsService.js';

export const getOrdersModule = async (req, res) => {
  const data = await internalOpsService.getOrdersModule(req.tenant.id, req.query.delivered || 'all');
  res.status(200).json({ success: true, data });
};

export const getProductionOverview = async (req, res) => {
  const data = await internalOpsService.getProductionOverview(req.tenant.id);
  res.status(200).json({ success: true, data });
};

export const getInventoryOverview = async (req, res) => {
  const data = await internalOpsService.getInventoryOverview(req.tenant.id);
  res.status(200).json({ success: true, data });
};

export const getFinanceOverview = async (req, res) => {
  const data = await internalOpsService.getFinanceOverview(req.tenant.id);
  res.status(200).json({ success: true, data });
};

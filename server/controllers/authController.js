import * as authService from '../services/authService.js';

export const signup = async (req, res) => {
  const user = await authService.signup({ ...req.body, tenantId: req.tenant.id });
  res.status(201).json({ success: true, data: user });
};

export const login = async (req, res) => {
  const result = await authService.login({ ...req.body, tenantId: req.tenant.id });
  res.status(200).json({ success: true, data: result });
};

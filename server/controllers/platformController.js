import bcrypt from 'bcryptjs';
import * as tenantService from '../services/tenantService.js';
import * as billingService from '../services/billingService.js';
import * as globalizationService from '../services/globalizationService.js';
import * as traceabilityService from '../services/traceabilityService.js';
import * as analyticsService from '../services/analyticsService.js';
import * as aiService from '../services/aiService.js';

export const getPlans = async (_req, res) => {
  res.status(200).json({ success: true, data: tenantService.getPlans() });
};

export const createTenant = async (req, res) => {
  const passwordHash = req.body.adminUser?.password ? await bcrypt.hash(req.body.adminUser.password, 12) : undefined;

  const tenant = await tenantService.createTenant({
    name: req.body.name,
    slug: req.body.slug,
    subdomain: req.body.subdomain,
    plan: req.body.plan,
    adminUser: req.body.adminUser
      ? {
          name: req.body.adminUser.name,
          email: req.body.adminUser.email,
          password: passwordHash,
        }
      : undefined,
  });

  res.status(201).json({ success: true, data: tenant });
};

export const getTenantContext = async (req, res) => {
  const context = await tenantService.getTenantContext(req.tenant.id);
  res.status(200).json({ success: true, data: context });
};

export const createInvoice = async (req, res) => {
  const invoice = await billingService.createInvoice({ tenantId: req.tenant.id, ...req.body });
  res.status(201).json({ success: true, data: invoice });
};

export const listInvoices = async (req, res) => {
  const invoices = await billingService.listInvoices(req.tenant.id);
  res.status(200).json({ success: true, data: invoices });
};

export const getLocalizationOptions = async (_req, res) => {
  res.status(200).json({ success: true, data: globalizationService.getLocalizationOptions() });
};

export const estimateTax = async (req, res) => {
  const estimate = await globalizationService.estimateTaxAndRegionalPrice(req.body);
  res.status(200).json({ success: true, data: estimate });
};

export const createMaterialBatch = async (req, res) => {
  const batch = await traceabilityService.createMaterialBatch({ tenantId: req.tenant.id, ...req.body });
  res.status(201).json({ success: true, data: batch });
};

export const issueCertificate = async (req, res) => {
  const certificate = await traceabilityService.issueCertificate({ tenantId: req.tenant.id, ...req.body });
  res.status(201).json({ success: true, data: certificate });
};

export const getEsgDashboard = async (req, res) => {
  const dashboard = await analyticsService.getEsgDashboard(req.tenant.id);
  res.status(200).json({ success: true, data: dashboard });
};

export const getInvestorDashboard = async (req, res) => {
  const dashboard = await analyticsService.getInvestorDashboard(req.tenant.id);
  res.status(200).json({ success: true, data: dashboard });
};

export const createForecast = async (req, res) => {
  const result = await aiService.createForecast({
    tenantId: req.tenant.id,
    forecastType: req.body.forecastType,
    context: req.body.context || {},
  });

  res.status(201).json({ success: true, data: result });
};

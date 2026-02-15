const ROLE_ALIASES = {
  SUPER_ADMIN: ['SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN'],
  SALES: ['SALES', 'SALES_MANAGER'],
  PRODUCTION: ['PRODUCTION', 'OPERATIONS_MANAGER'],
  FINANCE: ['FINANCE', 'FINANCE_MANAGER'],
  ORDER_HANDLER: ['ORDER_HANDLER', 'STAFF', 'VIEWER'],
};

const expandAllowedRoles = (roles) => {
  const expanded = new Set();
  roles.forEach((role) => {
    expanded.add(role);
    if (ROLE_ALIASES[role]) {
      ROLE_ALIASES[role].forEach((alias) => expanded.add(alias));
    }
  });
  return expanded;
};

export const authorizeRoles = (...allowedRoles) => (req, _res, next) => {
  if (!req.user?.role) {
    return next({ status: 403, message: 'Access denied.' });
  }

  const allowed = expandAllowedRoles(allowedRoles);

  if (!allowed.has(req.user.role)) {
    return next({ status: 403, message: 'You do not have permission for this action.' });
  }

  return next();
};

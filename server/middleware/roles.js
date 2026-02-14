export const authorizeRoles = (...allowedRoles) => (req, _res, next) => {
  if (!req.user?.role) {
    return next({ status: 403, message: 'Access denied.' });
  }

  if (!allowedRoles.includes(req.user.role)) {
    return next({ status: 403, message: 'You do not have permission for this action.' });
  }

  return next();
};

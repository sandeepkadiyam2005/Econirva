import jwt from 'jsonwebtoken';

export const authenticate = (req, _res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

  if (!token) {
    return next({ status: 401, message: 'Authentication token is required.' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (req.tenant?.id && payload.tenantId && payload.tenantId !== req.tenant.id) {
      return next({ status: 403, message: 'Token tenant mismatch.' });
    }

    req.user = payload;
    return next();
  } catch {
    return next({ status: 401, message: 'Invalid or expired token.' });
  }
};

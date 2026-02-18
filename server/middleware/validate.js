const isMissing = (value) => value === undefined || value === null || value === '';

export const requireFields = (fields) => (req, _res, next) => {
  const missing = fields.filter((field) => isMissing(req.body[field]));

  if (missing.length > 0) {
    return next({
      status: 400,
      message: 'Validation failed.',
      details: { missingFields: missing },
    });
  }

  return next();
};

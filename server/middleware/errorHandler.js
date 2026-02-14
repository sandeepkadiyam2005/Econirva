export const notFoundHandler = (_req, _res, next) => {
  next({ status: 404, message: 'Route not found.' });
};

export const errorHandler = (error, _req, res, _next) => {
  const statusCode = error.status || 500;

  res.status(statusCode).json({
    success: false,
    message: error.message || 'Internal server error.',
    details: error.details || undefined,
  });
};

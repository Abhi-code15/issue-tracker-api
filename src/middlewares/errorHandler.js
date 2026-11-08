export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Handle unique constraint violations from Postgres (e.g., duplicate email)
  if (err.code === '23505') {
    err.statusCode = 409;
    err.message = 'A record with that value already exists.';
  }

  // Handle foreign key constraint violations
  if (err.code === '23503') {
    err.statusCode = 400;
    err.message = 'Referenced record does not exist.';
  }

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
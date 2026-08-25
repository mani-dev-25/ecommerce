const errorHandler = (err, req, res, next) => {
  console.error('Error:', err); // Log the full error on the server side

  // Mongoose CastError (Invalid ID)
  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid resource ID.' });
  }

  // MongoDB duplicate key error
  if (err.code === 11000) {
    const duplicateField = Object.keys(err.keyValue)[0];
    return res.status(409).json({ error: `Duplicate value entered for ${duplicateField}.` });
  }

  // Mongoose ValidationError
  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message
    }));
    return res.status(400).json({
      error: 'Validation failed',
      details
    });
  }
  
  // Custom or generic error
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    error: err.message || 'Internal server error.',
    // Never expose stack traces in production
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;

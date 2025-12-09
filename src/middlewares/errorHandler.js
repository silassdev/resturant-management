export function errorHandler(err, req, res, next) {
  console.error('=== ERROR START ===');
  if (err && err.stack) console.error(err.stack);
  else console.error(err);
  console.error('=== ERROR END ===');

  const status = err?.status || 500;
  const payload = { message: err?.message || 'Internal Server Error' };

  if (process.env.NODE_ENV === 'development' && err?.stack) payload.stack = err.stack;

  res.status(status).json(payload);
}

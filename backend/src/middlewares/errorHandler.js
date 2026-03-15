export function errorHandler(err, req, res, next) {
  console.error('[Error]', err.message);
  const status = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';
  res.status(status).json({ error: message });
}

export function notFoundHandler(req, res) {
  res.status(404).json({ error: 'Ruta no encontrada' });
}

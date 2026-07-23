const notFound = (req, res, next) => {
  res.status(404).json({ error: `Rota não encontrada: ${req.method} ${req.originalUrl}` });
};

module.exports = notFound;
const errorHandler = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Erro de validação',
      details: Object.values(err.errors).map(e => e.message),
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ error: `ID inválido: ${err.value}` });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({ error: `${field} já está em uso` });
  }

  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Erro interno no servidor';

  if (!err.isOperational) {
    console.error('ERRO NÃO TRATADO:', err);
  }

  res.status(statusCode).json({ error: message });
};

module.exports = errorHandler;
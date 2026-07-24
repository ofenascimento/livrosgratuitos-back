const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../../utils/errors/UnauthorizedError');

function extractUser(req) {
  const bearerHeader = req.headers['authorization'];

  if (!bearerHeader) {
    throw new UnauthorizedError('Acesso negado. Nenhum token fornecido.');
  }

  const token = bearerHeader.split(' ')[1];

  if (!token) {
    throw new UnauthorizedError('Acesso negado. Nenhum token fornecido.');
  }

  try {
    return jwt.verify(token, process.env.TOKEN_SECRET);
  } catch (error) {
    throw new UnauthorizedError('Token inválido ou expirado.');
  }
}

module.exports = extractUser;
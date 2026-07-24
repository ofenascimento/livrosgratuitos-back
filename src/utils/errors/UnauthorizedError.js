const AppError = require('../AppError');

class UnauthorizedError extends AppError {
  constructor(message = 'Acesso negado. Nenhum token fornecido.') {
    super(message, 401);
  }
}

module.exports = UnauthorizedError;
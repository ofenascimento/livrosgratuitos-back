const extractUser = require('./auth/extractUser');
const ForbiddenError = require('../utils/errors/ForbiddenError');

function verifyAdmin(req, res, next) {
  try {
    req.user = extractUser(req);

    if (!req.user.isAdmin) {
      throw new ForbiddenError('Acesso negado. Requer privilégios de administrador.');
    }

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = verifyAdmin;
const ForbiddenError = require('../../../utils/errors/ForbiddenError');

function verifyUser(req, res, next) {
  const { user } = req;
  const { userId } = req.params;

  if (String(user._id) !== String(userId)) {
    return next(new ForbiddenError('Acesso negado.'));
  }

  next();
}

module.exports = verifyUser;
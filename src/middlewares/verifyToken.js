const extractUser = require('./auth/extractUser');

function verifyToken(req, res, next) {
  try {
    req.user = extractUser(req);
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = verifyToken;
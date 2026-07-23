const ValidationError = require('../utils/errors/ValidationError');

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const details = result.error.issues.map((issue) => issue.message);
    return next(new ValidationError(details.join(', ')));
  }

  req.body = result.data; 
  next();
};

module.exports = validate;
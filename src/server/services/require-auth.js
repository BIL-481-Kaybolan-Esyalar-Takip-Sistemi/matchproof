const { AppError } = require('./app-error');

function requireAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    next(
      new AppError('Authentication required.', {
        statusCode: 401,
        code: 'AUTH_REQUIRED',
      })
    );
    return;
  }

  next();
}

module.exports = { requireAuth };


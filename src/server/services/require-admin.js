const { AppError } = require('./app-error');
const { requireAuth } = require('./require-auth');

function requireAdmin(req, res, next) {
  requireAuth(req, res, (error) => {
    if (error) {
      next(error);
      return;
    }

    if (req.session.userRole !== 'admin') {
      next(
        new AppError('Admin privileges are required.', {
          statusCode: 403,
          code: 'ADMIN_REQUIRED',
        })
      );
      return;
    }

    next();
  });
}

module.exports = { requireAdmin };

const { AppError } = require("../utils/errors.util");

module.exports = function notFound(req, _res, next) {
  next(new AppError(404, "NOT_FOUND", `Route not found: ${req.method} ${req.originalUrl}`));
};
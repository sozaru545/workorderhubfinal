const { AppError } = require("../utils/errors.util");

module.exports = function auth(req, _res, next) {
  const apiKey = req.header("x-api-key");
  const expected = process.env.API_KEY;

  if (!expected) {
    return next(new AppError(500, "INTERNAL_ERROR", "API_KEY is not configured on the server"));
  }

  if (!apiKey || apiKey !== expected) {
    return next(new AppError(401, "UNAUTHORIZED", "Missing or invalid API key"));
  }

  next();
};
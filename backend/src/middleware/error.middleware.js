const { err } = require("../utils/response.util");
const { AppError } = require("../utils/errors.util");

module.exports = function errorMiddleware(error, req, res, _next) {
  // multer file too large
  if (error && error.code === "LIMIT_FILE_SIZE") {
    return err(res, 413, "PAYLOAD_TOO_LARGE", "Uploaded file is too large", []);
  }

  // known AppError
  if (error instanceof AppError) {
    return err(res, error.statusCode, error.code, error.message, error.details || []);
  }

  // csv parse / other known errors
  if (error && typeof error.message === "string" && error.message.toLowerCase().includes("csv")) {
    return err(res, 400, "VALIDATION_ERROR", "Invalid CSV format", []);
  }

  // unknown -> INTERNAL_ERROR (no stack traces)
  return err(res, 500, "INTERNAL_ERROR", "Unexpected server error", []);
};
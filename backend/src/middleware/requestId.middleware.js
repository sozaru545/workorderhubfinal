const { v4: uuid } = require("uuid");

module.exports = function requestId(req, res, next) {
  req.requestId = uuid();
  res.setHeader("x-request-id", req.requestId);
  next();
};
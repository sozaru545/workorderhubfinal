function ok(res, data, status = 200) {
  return res.status(status).json({
    requestId: res.req.requestId,
    success: true,
    data
  });
}

function okNoData(res) {
  return res.status(204).send();
}

function err(res, status, code, message, details = []) {
  return res.status(status).json({
    requestId: res.req.requestId,
    success: false,
    error: { code, message, details }
  });
}

module.exports = { ok, okNoData, err };
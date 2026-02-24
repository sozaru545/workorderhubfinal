const service = require("../services/workorders.service");
const { ok, okNoData } = require("../utils/response.util");

async function list(req, res, next) {
  try {
    const result = service.list(req.query);
    return ok(res, result);
  } catch (e) {
    next(e);
  }
}

async function getById(req, res, next) {
  try {
    const item = service.getById(req.params.id);
    return ok(res, item);
  } catch (e) {
    next(e);
  }
}

async function create(req, res, next) {
  try {
    const created = service.create(req.body);
    return ok(res, created, 201);
  } catch (e) {
    next(e);
  }
}

async function update(req, res, next) {
  try {
    const updated = service.update(req.params.id, req.body);
    return ok(res, updated);
  } catch (e) {
    next(e);
  }
}

async function changeStatus(req, res, next) {
  try {
    const updated = service.changeStatus(req.params.id, req.body.status);
    return ok(res, updated);
  } catch (e) {
    next(e);
  }
}

async function remove(req, res, next) {
  try {
    service.remove(req.params.id);
    // 204 no body
    return okNoData(res);
  } catch (e) {
    next(e);
  }
}

async function bulkUpload(req, res, next) {
  try {
    const result = await service.bulkUpload(req.file);
    return ok(res, result);
  } catch (e) {
    next(e);
  }
}

module.exports = {
  list,
  getById,
  create,
  update,
  changeStatus,
  remove,
  bulkUpload
};
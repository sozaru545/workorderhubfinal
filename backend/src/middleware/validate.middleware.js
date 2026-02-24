const { AppError } = require("../utils/errors.util");
const { DEPARTMENTS, PRIORITIES, STATUSES } = require("../utils/constants");

function isNonEmptyString(v) {
  return typeof v === "string" && v.trim().length > 0;
}

const createSchema = (body) => {
  const details = [];

  if (!isNonEmptyString(body.title) || body.title.trim().length < 5)
    details.push({ field: "title", reason: "Min 5 chars" });

  if (!isNonEmptyString(body.description) || body.description.trim().length < 10)
    details.push({ field: "description", reason: "Min 10 chars" });

  if (!isNonEmptyString(body.requesterName) || body.requesterName.trim().length < 3)
    details.push({ field: "requesterName", reason: "Min 3 chars" });

  if (!isNonEmptyString(body.department) || !DEPARTMENTS.includes(body.department))
    details.push({ field: "department", reason: "Must be FACILITIES/IT/SECURITY/HR" });

  if (!isNonEmptyString(body.priority) || !PRIORITIES.includes(body.priority))
    details.push({ field: "priority", reason: "Must be LOW/MEDIUM/HIGH" });

  if (details.length) throw new AppError(400, "VALIDATION_ERROR", "Invalid request body", details);
};

const updateSchema = (body) => {
  const details = [];

  if (body.title !== undefined && (!isNonEmptyString(body.title) || body.title.trim().length < 5))
    details.push({ field: "title", reason: "Min 5 chars" });

  if (body.description !== undefined && (!isNonEmptyString(body.description) || body.description.trim().length < 10))
    details.push({ field: "description", reason: "Min 10 chars" });

  if (body.priority !== undefined && (!isNonEmptyString(body.priority) || !PRIORITIES.includes(body.priority)))
    details.push({ field: "priority", reason: "Must be LOW/MEDIUM/HIGH" });

  // assignee can be string or null
  if (body.assignee !== undefined && body.assignee !== null && typeof body.assignee !== "string")
    details.push({ field: "assignee", reason: "Must be string or null" });

  if (details.length) throw new AppError(400, "VALIDATION_ERROR", "Invalid request body", details);
};

const statusSchema = (body) => {
  const details = [];
  if (!isNonEmptyString(body.status) || !Object.values(STATUSES).includes(body.status)) {
    details.push({ field: "status", reason: "Must be NEW/IN_PROGRESS/BLOCKED/DONE" });
  }
  if (details.length) throw new AppError(400, "VALIDATION_ERROR", "Invalid request body", details);
};

module.exports = function validate(schemaFn) {
  return (req, _res, next) => {
    try {
      schemaFn(req.body || {});
      next();
    } catch (e) {
      next(e);
    }
  };
};

module.exports.createSchema = createSchema;
module.exports.updateSchema = updateSchema;
module.exports.statusSchema = statusSchema;
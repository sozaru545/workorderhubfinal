const { v4: uuid } = require("uuid");
const { parse } = require("csv-parse");
const store = require("../data/workorders.store");
const { AppError } = require("../utils/errors.util");
const { DEPARTMENTS, PRIORITIES, STATUSES, ALLOWED_TRANSITIONS } = require("../utils/constants");

function nowIso() {
  return new Date().toISOString();
}

function assertEnum(value, allowed, field) {
  if (!allowed.includes(value)) {
    throw new AppError(400, "VALIDATION_ERROR", `Invalid ${field}`, [
      { field, reason: `Must be one of: ${allowed.join(", ")}` }
    ]);
  }
}

function list(query) {
  const {
    status,
    department,
    priority,
    assignee,
    q,
    page = "1",
    limit = "10"
  } = query;

  let items = store.all();

  if (status) items = items.filter(w => w.status === status);
  if (department) items = items.filter(w => w.department === department);
  if (priority) items = items.filter(w => w.priority === priority);
  if (assignee) items = items.filter(w => (w.assignee || "") === assignee);
  if (q) {
    const needle = String(q).toLowerCase();
    items = items.filter(w => String(w.title).toLowerCase().includes(needle));
  }

  const p = Math.max(1, parseInt(page, 10) || 1);
  const l = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));

  const total = items.length;
  const start = (p - 1) * l;
  const paged = items.slice(start, start + l);

  return { items: paged, page: p, limit: l, total };
}

function getById(id) {
  const item = store.get(id);
  if (!item) throw new AppError(404, "NOT_FOUND", "Work order not found");
  return item;
}

function create(payload) {
  // payload already validated by middleware
  assertEnum(payload.department, DEPARTMENTS, "department");
  assertEnum(payload.priority, PRIORITIES, "priority");

  const t = nowIso();
  const workOrder = {
    id: uuid(),
    title: payload.title,
    description: payload.description,
    department: payload.department,
    priority: payload.priority,
    status: STATUSES.NEW,
    requesterName: payload.requesterName,
    assignee: payload.assignee ?? null,
    createdAt: t,
    updatedAt: t
  };

  store.set(workOrder);
  return workOrder;
}

function update(id, payload) {
  const existing = getById(id);

  const updated = {
    ...existing,
    title: payload.title ?? existing.title,
    description: payload.description ?? existing.description,
    priority: payload.priority ?? existing.priority,
    assignee: payload.assignee !== undefined ? payload.assignee : existing.assignee,
    updatedAt: nowIso()
  };

  if (updated.priority) assertEnum(updated.priority, PRIORITIES, "priority");

  store.set(updated);
  return updated;
}

function changeStatus(id, nextStatus) {
  const existing = getById(id);
  assertEnum(nextStatus, Object.values(STATUSES), "status");

  const allowedNext = ALLOWED_TRANSITIONS[existing.status] || [];
  if (!allowedNext.includes(nextStatus)) {
    throw new AppError(409, "INVALID_TRANSITION", "Invalid status transition", [
      { from: existing.status, to: nextStatus }
    ]);
  }

  const updated = { ...existing, status: nextStatus, updatedAt: nowIso() };
  store.set(updated);
  return updated;
}

function remove(id) {
  // must 404 if not found
  getById(id);
  store.del(id);
}

function normalizeHeader(h) {
  return String(h || "").trim().toLowerCase();
}

function validateRow(row, rowIndex) {
  const errors = [];

  const title = String(row.title || "").trim();
  const description = String(row.description || "").trim();
  const department = String(row.department || "").trim();
  const priority = String(row.priority || "").trim();
  const requesterName = String(row.requesterName || "").trim();
  const assignee = row.assignee !== undefined ? String(row.assignee).trim() : undefined;

  if (title.length < 5) errors.push({ row: rowIndex, field: "title", reason: "Min 5 chars" });
  if (description.length < 10) errors.push({ row: rowIndex, field: "description", reason: "Min 10 chars" });
  if (requesterName.length < 3) errors.push({ row: rowIndex, field: "requesterName", reason: "Min 3 chars" });

  if (!DEPARTMENTS.includes(department)) {
    errors.push({ row: rowIndex, field: "department", reason: "Must be FACILITIES/IT/SECURITY/HR" });
  }
  if (!PRIORITIES.includes(priority)) {
    errors.push({ row: rowIndex, field: "priority", reason: "Must be LOW/MEDIUM/HIGH" });
  }

  return {
    ok: errors.length === 0,
    errors,
    value: { title, description, department, priority, requesterName, assignee }
  };
}

// Strategy A — Partial Acceptance (spec allows choosing one)
async function bulkUpload(file) {
  if (!file) throw new AppError(400, "VALIDATION_ERROR", "Missing file");

  const csvText = file.buffer.toString("utf8");

  const records = await new Promise((resolve, reject) => {
    parse(
      csvText,
      {
        columns: header => header.map(normalizeHeader),
        skip_empty_lines: true,
        trim: true
      },
      (err, output) => (err ? reject(err) : resolve(output))
    );
  });

  // required headers
  const required = ["title", "description", "department", "priority", "requestername"];
  // because we normalized to lowercase, requesterName becomes requestername (csv-parse header mapping)
  // We'll accept either requestername or requesterName in the input, but after normalize it becomes requestername.
  const first = records[0] || {};
  const keys = Object.keys(first);

  for (const r of required) {
    if (!keys.includes(r)) {
      throw new AppError(400, "VALIDATION_ERROR", "CSV missing required headers", [
        { field: r, reason: "Required header missing" }
      ]);
    }
  }

  const uploadId = uuid();
  const strategy = "PARTIAL_ACCEPTANCE";

  let accepted = 0;
  let rejected = 0;
  const errors = [];

  // NOTE: map requestername -> requesterName so our service.create expects requesterName
  for (let i = 0; i < records.length; i++) {
    const raw = records[i];
    const row = {
      ...raw,
      requesterName: raw.requestername
    };

    const rowNumber = i + 2; // +1 for 0-index, +1 for header row
    const v = validateRow(row, rowNumber);

    if (!v.ok) {
      rejected++;
      errors.push(...v.errors);
      continue;
    }

    // create work order
    create(v.value);
    accepted++;
  }

  return {
    uploadId,
    strategy,
    totalRows: records.length,
    accepted,
    rejected,
    errors
  };
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
const router = require("express").Router();
const multer = require("multer");

const auth = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");

const controller = require("../controllers/workorders.controller");
const { createSchema, updateSchema, statusSchema } = require("../middleware/validate.middleware");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (_req, file, cb) => {
    const ok =
      file.mimetype === "text/csv" ||
      file.mimetype === "application/vnd.ms-excel" ||
      (file.originalname && file.originalname.toLowerCase().endsWith(".csv"));

    if (!ok) {
      const { AppError } = require("../utils/errors.util");
      return cb(new AppError(415, "UNSUPPORTED_MEDIA_TYPE", "Only .csv files are accepted"));
    }
    cb(null, true);
  }
});

// All /api/** routes require x-api-key
router.use(auth);

router.get("/", controller.list);
router.get("/:id", controller.getById);
router.get("/board", async (req, res) => {
  
  res.json({
    NEW: 0,
    IN_PROGRESS: 0,
    BLOCKED: 0,
    DONE: 0,
  });
});

router.post("/", validate(createSchema), controller.create);
router.put("/:id", validate(updateSchema), controller.update);
router.patch("/:id/status", validate(statusSchema), controller.changeStatus);

// Delete: return 204 (allowed by spec)
router.delete("/:id", controller.remove);

// Bulk upload (two paths supported: spec + business req)
router.post("/bulk-upload", upload.single("file"), controller.bulkUpload);
router.post("/data-transfer", upload.single("file"), controller.bulkUpload);

module.exports = router;
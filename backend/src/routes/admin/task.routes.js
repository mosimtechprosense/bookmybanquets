const express = require("express");
const {
  assignTaskController,
  listTasksController,
  getTaskByIdController,
  submitTaskReportController,
} = require("../../controllers/admin/task.controller");

const { auth } = require("../../middlewares/admin/auth.middleware");

const router = express.Router();

// Apply auth to all task routes
router.use(auth);

// assign task
router.post("/", assignTaskController);

// list tasks (role-based)
router.get("/", listTasksController);

// task detail (eye icon)
router.get("/:id", getTaskByIdController);

// submit report
router.post("/:id/report", submitTaskReportController);

module.exports = router;

import express from "express";
import {
  assignTaskController,
  listTasksController,
  getTaskByIdController,
  submitTaskReportController
} from "../../controllers/admin/task.controller.js";
import { auth } from "../../middlewares/admin/auth.middleware.js";

const router = express.Router();

router.use(auth);

// assign task
router.post("/", assignTaskController);

// list tasks (role-based)
router.get("/", listTasksController);

// task detail (eye icon)
router.get("/:id", getTaskByIdController);

// submit report
router.post("/:id/report", submitTaskReportController);

export default router;

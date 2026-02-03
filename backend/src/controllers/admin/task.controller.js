import {
  assignTask,
  listTasksByRole,
  getTaskById,
  submitTaskReport
} from "../../services/admin/task.service.js";

export const assignTaskController = async (req, res) => {
  try {
    const task = await assignTask(req.body);
    res.json({ message: "Task assigned", task });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const listTasksController = async (req, res) => {
  try {
    const tasks = await listTasksByRole(req.user);
    res.json(tasks);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getTaskByIdController = async (req, res) => {
  const task = await getTaskById(req.params.id);
  res.json(task);
};

export const submitTaskReportController = async (req, res) => {
  await submitTaskReport(req.params.id, req.body);
  res.json({ message: "Report submitted" });
};

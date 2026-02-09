const {
  assignTask,
  listTasksByRole,
  getTaskById,
  submitTaskReport,
} = require("../../services/admin/task.service");

// assign task
const assignTaskController = async (req, res) => {
  try {
    const task = await assignTask(req.body);
    res.json({ message: "Task assigned", task });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// list tasks (role-based)
const listTasksController = async (req, res) => {
  try {
    const tasks = await listTasksByRole(req.user);
    res.json(tasks);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// task detail
const getTaskByIdController = async (req, res) => {
  const task = await getTaskById(req.params.id);
  res.json(task);
};

// submit report
const submitTaskReportController = async (req, res) => {
  await submitTaskReport(req.params.id, req.body);
  res.json({ message: "Report submitted" });
};

module.exports = {
  assignTaskController,
  listTasksController,
  getTaskByIdController,
  submitTaskReportController,
};

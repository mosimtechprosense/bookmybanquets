import axios from "./axios";

export const assignTask = (data) =>
  axios.post("/admin/tasks", data);

export const fetchTasks = () =>
  axios.get("/admin/tasks");

export const fetchTaskById = (id) =>
  axios.get(`/admin/tasks/${id}`);

export const submitTaskReport = (id, data) =>
  axios.post(`/admin/tasks/${id}/report`, data);

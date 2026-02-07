import adminApi from "./adminApi";

/* ================= LEADS ================= */

export const fetchLeads = ({ page, limit, search }) =>
  adminApi.get("/leads", {
    params: { page, limit, search }
  });

export const fetchLeadById = (id) =>
  adminApi.get(`/leads/${id}`);

export const createLead = (data) =>
  adminApi.post("/leads", data);


export const updateLead = (id, data) =>
  adminApi.put(`/leads/${id}`, data);

/* ================= RM NOTES ================= */

export const fetchRMNotes = (id) =>
  adminApi.get(`/leads/${id}/rm-notes`);

export const addRMNote = (id, note) =>
  adminApi.post(`/leads/${id}/rm-notes`, { note });

/* ================= EVENTS ================= */

export const fetchLeadEvents = (id) =>
  adminApi.get(`/leads/${id}/events`);

export const addLeadEvent = (id, data) =>
  adminApi.post(`/leads/${id}/events`, data);

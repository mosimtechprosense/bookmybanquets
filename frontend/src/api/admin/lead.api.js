import axios from "axios";

// leads
export const fetchLeads = () =>
  axios.get("/admin/leads");

export const fetchLeadById = (id) =>
  axios.get(`/admin/leads/${id}`);

export const updateLead = (id, data) =>
  axios.put(`/admin/leads/${id}`, data);

// rm notes
export const fetchRMNotes = (id) =>
  axios.get(`/admin/leads/${id}/rm-notes`);

export const addRMNote = (id, note) =>
  axios.post(`/admin/leads/${id}/rm-notes`, { note });

// events
export const fetchLeadEvents = (id) =>
  axios.get(`/admin/leads/${id}/events`);

export const addLeadEvent = (id, data) =>
  axios.post(`/admin/leads/${id}/events`, data);

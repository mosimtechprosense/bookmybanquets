import {
  getLeads,
  getLeadById,
  updateLead,
  addRMNote,
  getRMNotes,
  addLeadEvent,
  getLeadEvents,
  updateRMNote,
  deleteRMNote,
  updateLeadEvent,
  deleteLeadEvent,
  createLead,
  deleteLead
} from "../../services/admin/lead.service.js";


//* LEADS
export const listLeadsController = async (req, res) => {
  const leads = await getLeads();
  res.json(leads);
};

export const getLeadController = async (req, res) => {
  const lead = await getLeadById(req.params.id);
  if (!lead) {
    return res.status(404).json({ message: "Lead not found" });
  }
  res.json(lead);
};

export const createLeadController = async (req, res) => {
  const lead = await createLead(req.body);
  res.status(201).json(lead);
};

export const deleteLeadController = async (req, res) => {
  await deleteLead(req.params.id);
  res.json({ message: "Lead deleted" });
};

export const updateLeadController = async (req, res) => {
  await updateLead(req.params.id, req.body);
  res.json({ message: "Lead updated" });
};

//* RM NOTES
export const addRMNoteController = async (req, res) => {
  await addRMNote(req.params.id, req.user.id, req.body.note);
  res.json({ message: "RM Note added" });
};

export const getRMNotesController = async (req, res) => {
  const notes = await getRMNotes(req.params.id);
  res.json(notes);
};

export const updateRMNoteController = async (req, res) => {
  await updateRMNote(req.params.noteId, req.body.note);
  res.json({ message: "RM Note updated" });
};

export const deleteRMNoteController = async (req, res) => {
  await deleteRMNote(req.params.noteId);
  res.json({ message: "RM Note deleted" });
};


//* EVENTS
export const addLeadEventController = async (req, res) => {
  await addLeadEvent(req.params.id, req.body, req.user.id);
  res.json({ message: "Event added" });
};

export const getLeadEventsController = async (req, res) => {
  const events = await getLeadEvents(req.params.id);
  res.json(events);
};


export const updateLeadEventController = async (req, res) => {
  await updateLeadEvent(req.params.eventId, req.body);
  res.json({ message: "Event updated" });
};


export const deleteLeadEventController = async (req, res) => {
  await deleteLeadEvent(req.params.eventId);
  res.json({ message: "Event deleted" });
};


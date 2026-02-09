const {
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
  deleteLead,
  getLeadsPaginated,
} = require("../../services/admin/lead.service");

//* LEADS
const listLeadsController = async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  const search = req.query.search || "";

  const result = await getLeadsPaginated({ page, limit, search });
  res.json(result);
};

const getLeadController = async (req, res) => {
  const lead = await getLeadById(req.params.id);
  if (!lead) {
    return res.status(404).json({ message: "Lead not found" });
  }
  res.json(lead);
};

const createLeadController = async (req, res) => {
  try {
    // Validate and parse event_date
    let eventDate = null;
    if (req.body.event_date) {
      const parsed = new Date(req.body.event_date);
      if (!isNaN(parsed.getTime())) {
        eventDate = parsed;
      } else {
        return res.status(400).json({ message: "Invalid event_date" });
      }
    }

    const data = {
      name: req.body.name || null,
      email: req.body.email || null,
      phone: req.body.phone || null,
      preferred_location: req.body.preferred_location || null,
      source: req.body.source || null,
      no_guest: req.body.no_guest || null,
      event_date: eventDate,
      slot: req.body.slot || null,
      menu: req.body.menu || null,
      event_type: req.body.event_type || null,
      budget: req.body.budget || null,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const lead = await createLead(data);
    res.status(201).json(lead);
  } catch (err) {
    console.error("CREATE LEAD ERROR:", err);
    res.status(400).json({
      message: "Failed to create lead",
      error: err.message,
    });
  }
};

const deleteLeadController = async (req, res) => {
  await deleteLead(req.params.id);
  res.json({ message: "Lead deleted" });
};

const updateLeadController = async (req, res) => {
  try {
    const { id, created_at, updated_at, ...data } = req.body;

    // Validate date
    let eventDate = null;
    if (data.event_date) {
      const parsedDate = new Date(data.event_date);
      if (!isNaN(parsedDate.getTime())) {
        eventDate = parsedDate;
      } else {
        return res.status(400).json({ message: "Invalid event_date" });
      }
    }

    const safeData = {
      ...data,
      event_date: eventDate,
      slot: data.slot || null,
      menu: data.menu || null,
      no_guest: data.no_guest === "" ? null : data.no_guest,
      updated_at: new Date(),
    };

    await updateLead(req.params.id, safeData);
    res.json({ message: "Lead updated" });
  } catch (err) {
    console.error("UPDATE LEAD ERROR:", err);
    res.status(400).json({
      message: "Failed to update lead",
      error: err.message,
    });
  }
};

//* RM NOTES
const addRMNoteController = async (req, res) => {
  await addRMNote(req.params.id, req.user.id, req.body.note);
  res.json({ message: "RM Note added" });
};

const getRMNotesController = async (req, res) => {
  const notes = await getRMNotes(req.params.id);
  res.json(notes);
};

const updateRMNoteController = async (req, res) => {
  await updateRMNote(req.params.noteId, req.body.note);
  res.json({ message: "RM Note updated" });
};

const deleteRMNoteController = async (req, res) => {
  await deleteRMNote(req.params.noteId);
  res.json({ message: "RM Note deleted" });
};

//* EVENTS
const addLeadEventController = async (req, res) => {
  await addLeadEvent(req.params.id, req.body, req.user.id);
  res.json({ message: "Event added" });
};

const getLeadEventsController = async (req, res) => {
  const events = await getLeadEvents(req.params.id);
  res.json(events);
};

const updateLeadEventController = async (req, res) => {
  await updateLeadEvent(req.params.eventId, req.body);
  res.json({ message: "Event updated" });
};

const deleteLeadEventController = async (req, res) => {
  await deleteLeadEvent(req.params.eventId);
  res.json({ message: "Event deleted" });
};

module.exports = {
  listLeadsController,
  getLeadController,
  createLeadController,
  updateLeadController,
  deleteLeadController,
  addRMNoteController,
  getRMNotesController,
  updateRMNoteController,
  deleteRMNoteController,
  addLeadEventController,
  getLeadEventsController,
  updateLeadEventController,
  deleteLeadEventController,
};

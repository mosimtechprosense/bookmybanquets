const express = require("express");
const {
  listLeadsController,
  getLeadController,
  updateLeadController,
  addRMNoteController,
  getRMNotesController,
  addLeadEventController,
  getLeadEventsController,
  createLeadController,
  deleteLeadEventController,
  updateRMNoteController,
  deleteRMNoteController,
  updateLeadEventController,
  deleteLeadController,
} = require("../../controllers/admin/lead.controller");

const { auth } = require("../../middlewares/admin/auth.middleware");

const router = express.Router();

// Apply auth to all lead routes
router.use(auth);

//* LEADS
router.get("/", listLeadsController);
router.post("/", createLeadController);
router.get("/:id", getLeadController);
router.put("/:id", updateLeadController);
router.delete("/:id", deleteLeadController);

//* RM NOTES
router.get("/:id/rm-notes", getRMNotesController);
router.post("/:id/rm-notes", addRMNoteController);
router.put("/rm-notes/:noteId", updateRMNoteController);
router.delete("/rm-notes/:noteId", deleteRMNoteController);

//* EVENTS
router.get("/:id/events", getLeadEventsController);
router.post("/:id/events", addLeadEventController);
router.put("/events/:eventId", updateLeadEventController);
router.delete("/events/:eventId", deleteLeadEventController);

module.exports = router;

import express from "express";
import {
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
  updateLeadEventController
} from "../../controllers/admin/lead.controller.js";

import { auth } from "../../middlewares/admin/auth.middleware.js";

const router = express.Router();
router.use(auth);

//* LEADS
router.get("/", listLeadsController);
router.post("/", createLeadController);
router.get("/:id", getLeadController);
router.put("/:id", updateLeadController);
router.delete("/:id", deleteLeadEventController);


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


export default router;

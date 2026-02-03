import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

//* LEADS
export const getLeads = () =>
  prisma.banquet_inquiries.findMany({
    orderBy: { created_at: "desc" }
  });

export const getLeadById = (id) =>
  prisma.banquet_inquiries.findUnique({
    where: { id: BigInt(id) }
  });

export const createLead = (data) =>
  prisma.banquet_inquiries.create({
    data
  });

export const deleteLead = (id) =>
  prisma.banquet_inquiries.delete({
    where: { id: BigInt(id) }
  });

export const updateLead = (id, data) =>
  prisma.banquet_inquiries.update({
    where: { id: BigInt(id) },
    data
  });

//* RM NOTES
export const addRMNote = (leadId, userId, note) =>
  prisma.lead_rm_notes.create({
    data: {
      banquet_inquiry_id: BigInt(leadId),
      created_by: BigInt(userId),
      note
    }
  });

export const getRMNotes = (leadId) =>
  prisma.lead_rm_notes.findMany({
    where: { banquet_inquiry_id: BigInt(leadId) },
    orderBy: { created_at: "desc" }
  });

  export const updateRMNote = (noteId, note) =>
  prisma.lead_rm_notes.update({
    where: { id: BigInt(noteId) },
    data: { note }
  });

  export const deleteRMNote = (noteId) =>
  prisma.lead_rm_notes.delete({
    where: { id: BigInt(noteId) }
  });



//* EVENTS
export const addLeadEvent = (leadId, data, userId) =>
  prisma.lead_events.create({
    data: {
      banquet_inquiry_id: BigInt(leadId),
      type: data.type,
      description: data.description,
      next_event_date: data.next_event_date || null,
      created_by: BigInt(userId)
    }
  });

export const getLeadEvents = (leadId) =>
  prisma.lead_events.findMany({
    where: { banquet_inquiry_id: BigInt(leadId) },
    orderBy: { created_at: "desc" }
  });


  export const updateLeadEvent = (eventId, data) =>
  prisma.lead_events.update({
    where: { id: BigInt(eventId) },
    data: {
      type: data.type,
      description: data.description,
      next_event_date: data.next_event_date || null
    }
  });


  export const deleteLeadEvent = (eventId) =>
  prisma.lead_events.delete({
    where: { id: BigInt(eventId) }
  });
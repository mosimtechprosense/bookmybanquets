const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


//* LEADS
const getLeads = () =>
  prisma.banquet_inquiries.findMany({
    orderBy: { created_at: "desc" }
  });

const getLeadById = (id) =>
  prisma.banquet_inquiries.findUnique({
    where: { id: BigInt(id) }
  });

const createLead = (data) =>
  prisma.banquet_inquiries.create({
    data
  });

const deleteLead = (id) =>
  prisma.banquet_inquiries.delete({
    where: { id: BigInt(id) }
  });

const updateLead = (id, data) =>
  prisma.banquet_inquiries.update({
    where: { id: BigInt(id) },
    data
  });

const getLeadsPaginated = async ({ page, limit, search }) => {
  const skip = (page - 1) * limit;

  const where = search
    ? {
        OR: [
          { name: { contains: search } },
          { phone: { contains: search } }
        ]
      }
    : {};

  const [data, total] = await Promise.all([
    prisma.banquet_inquiries.findMany({
      where,
      orderBy: { created_at: "desc" },
      skip,
      take: limit
    }),
    prisma.banquet_inquiries.count({ where })
  ]);

  return {
    data,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  };
};


//* RM NOTES
const addRMNote = (leadId, userId, note) =>
  prisma.lead_rm_notes.create({
    data: {
      banquet_inquiry_id: BigInt(leadId),
      created_by: BigInt(userId),
      note
    }
  });

const getRMNotes = (leadId) =>
  prisma.lead_rm_notes.findMany({
    where: { banquet_inquiry_id: BigInt(leadId) },
    orderBy: { created_at: "desc" }
  });

const updateRMNote = (noteId, note) =>
  prisma.lead_rm_notes.update({
    where: { id: BigInt(noteId) },
    data: { note }
  });

const deleteRMNote = (noteId) =>
  prisma.lead_rm_notes.delete({
    where: { id: BigInt(noteId) }
  });


//* EVENTS
const addLeadEvent = (leadId, data, userId) =>
  prisma.lead_events.create({
    data: {
      banquet_inquiry_id: BigInt(leadId),
      type: data.type,
      description: data.description,
      next_event_date: data.next_event_date || null,
      created_by: BigInt(userId)
    }
  });

const getLeadEvents = (leadId) =>
  prisma.lead_events.findMany({
    where: { banquet_inquiry_id: BigInt(leadId) },
    orderBy: { created_at: "desc" }
  });

const updateLeadEvent = (eventId, data) =>
  prisma.lead_events.update({
    where: { id: BigInt(eventId) },
    data: {
      type: data.type,
      description: data.description,
      next_event_date: data.next_event_date || null
    }
  });

const deleteLeadEvent = (eventId) =>
  prisma.lead_events.delete({
    where: { id: BigInt(eventId) }
  });


module.exports = {
  getLeads,
  getLeadById,
  createLead,
  deleteLead,
  updateLead,
  getLeadsPaginated,
  addRMNote,
  getRMNotes,
  updateRMNote,
  deleteRMNote,
  addLeadEvent,
  getLeadEvents,
  updateLeadEvent,
  deleteLeadEvent
};

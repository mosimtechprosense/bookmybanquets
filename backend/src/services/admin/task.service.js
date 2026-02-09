const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// 1️⃣ ASSIGN TASK
const assignTask = async ({
  banquet_inquiry_id,
  manager_id,
  assignedForDate
}) => {
  return prisma.tasks.create({
    data: {
      banquet_inquiry_id: BigInt(banquet_inquiry_id),
      manager_id: BigInt(manager_id),
      assignedForDate: new Date(assignedForDate),
      status: "PENDING"
    }
  });
};

// 2️⃣ ROLE BASED TASK LIST
const listTasksByRole = async (user) => {
  const baseQuery = {
    include: {
      lead: true,
      manager: { select: { name: true } }
    },
    orderBy: { assignedForDate: "desc" }
  };

  if (user.role === "VENUE_MANAGER") {
    return prisma.tasks.findMany({
      ...baseQuery,
      where: { manager_id: BigInt(user.id) }
    });
  }

  // ADMIN / SUPER_ADMIN
  return prisma.tasks.findMany(baseQuery);
};

// 3️⃣ TASK DETAIL (EYE ICON)
const getTaskById = (id) =>
  prisma.tasks.findUnique({
    where: { id: BigInt(id) },
    include: {
      lead: true,
      reports: true,
      manager: { select: { name: true } }
    }
  });

// 4️⃣ SUBMIT REPORT
const submitTaskReport = (taskId, { remark, visitDate }) =>
  prisma.task_reports.create({
    data: {
      task_id: BigInt(taskId),
      remark,
      visitDate: new Date(visitDate)
    }
  });

module.exports = {
  assignTask,
  listTasksByRole,
  getTaskById,
  submitTaskReport
};

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";



const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

// --- User CRUD ---
export const createUser = async ({ name, email, password, role, is_active }) => {
  if (!["LEAD_USER", "DATA_ENTRY_USER", "VENUE_MANAGER", "ADMIN"].includes(role)) throw new Error("Invalid role");

  if (!password || password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.admins.create({
    data: {
      name,
      email,
      role,
      is_active,
      password: hashedPassword,
    },
  });

  return user;
};

export const listUsers = async (currentRole) => {
  return prisma.admins.findMany({
    where:
      currentRole === "SUPER_ADMIN"
        ? {}
        : { role: { not: "SUPER_ADMIN" } },
    select: { id: true, name: true, email: true, role: true, is_active: true },
  });
};


export const updateUser = async (id, data) => {
  const { password, ...safeData } = data; 

  return await prisma.admins.update({
    where: { id: BigInt(id) },
    data: safeData,
  });
};


export const deleteUser = async (id) => {
  return await prisma.admins.delete({
    where: { id: BigInt(id) },
  });
};


export const getUserById = async (id) => {
  return await prisma.admins.findUnique({
    where: { id: BigInt(id) },
    select: { id: true, name: true, email: true, role: true, is_active: true },
  });
};


export const adminResetPassword = async (id, newPassword) => {
  if (!newPassword || newPassword.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

  await prisma.admins.update({
    where: { id: BigInt(id) },
    data: {
      password: hashedPassword,
    },
  });

  return true;
};


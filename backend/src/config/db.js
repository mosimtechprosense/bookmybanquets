// Load .env variables before importing Prisma
require("dotenv").config()

const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

async function connectDB() {
  try {
    await prisma.$connect()
    console.log("✅ Connected to MySQL with Prisma")
  } catch (err) {
    console.error("❌ Prisma connection error:", err)
    process.exit(1) // stop the server if DB fails
  }
}

connectDB()

module.exports = prisma

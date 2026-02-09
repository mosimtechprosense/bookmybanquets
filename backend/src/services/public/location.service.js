const prisma = require("../../config/db.js")
const { Prisma } = require("@prisma/client")

// Function to get all locations
const getAllLocationsDB = async (query = {}) => {
  const locations = await prisma.$queryRaw(Prisma.sql`
    SELECT l.*, c.id as city_id, c.name as city_name
    FROM location l
    JOIN city c ON l.cityId = c.id
    ${
      query.city
        ? Prisma.sql`WHERE LOWER(l.name) LIKE LOWER(${`%${query.city.replace(/-/g, " ")}%`})`
        : Prisma.sql``
    }
  `)

  return locations
}

// Function to create the location if it does not exist
const createLocationDB = async (name, cityName) => {
  const city = await prisma.city.upsert({
    where: { name: cityName },
    update: {},
    create: { name: cityName }
  })

  return prisma.location.create({
    data: { name, cityId: city.id }
  })
}

// Function to update the location
const updateLocationDB = async (id, name) => {
  return prisma.location.update({
    where: { id: Number(id) },
    data: { name }
  })
}

// Function to delete the location
const deleteLocationDB = async (id) => {
  return prisma.location.delete({
    where: { id: Number(id) }
  })
}

module.exports = {
  getAllLocationsDB,
  createLocationDB,
  updateLocationDB,
  deleteLocationDB
}

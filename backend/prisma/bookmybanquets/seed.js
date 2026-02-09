const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

async function seedLocations() {
  const locations = [
    { location: "Moti Nagar", city: "Delhi" },
    { location: "Kirti Nagar", city: "Delhi" },
    { location: "Uttam Nagar", city: "Delhi" },
    { location: "Punjabi Bagh", city: "Delhi" },
    { location: "Hari Nagar", city: "Delhi" },
    { location: "Ramesh Nagar", city: "Delhi" },
    { location: "Loha Mandi", city: "Delhi" },
    { location: "Janakpuri", city: "Delhi" },
    { location: "Dwarka", city: "Delhi" }
  ]

  for (const loc of locations) {
    const city = await prisma.city.upsert({
      where: { name: loc.city },
      update: {},
      create: { name: loc.city },
    })

    await prisma.location.upsert({
      where: {
        name_cityId: {
          name: loc.location,
          cityId: city.id,
        },
      },
      update: {},
      create: {
        name: loc.location,
        cityId: city.id,
      },
    })
  }

  console.log("✔️ Locations seeded")
}

async function seedListings() {
  const motiNagar = await prisma.location.findFirst({
    where: { name: "Moti Nagar" },
  })

  if (!motiNagar) {
    console.log("⚠️ Cannot seed listings — Moti Nagar not found")
    return
  }

  await prisma.listing.createMany({
    data: [
      {
        title: "Royal Palace Banquet",
        description: "A luxury banquet hall for weddings and events.",
        city: "moti-nagar",
        search: "Banquet Halls",
        localityId: motiNagar.id,
        vegetarian: 1,
        nonVegetarian: 1,
        minBudget: 800,
        maxBudget: 2000,
        created_at: new Date(),
      },
      {
        title: "Dream Event Hall",
        description: "Spacious banquet hall with premium services.",
        city: "moti-nagar",
        search: "Banquet Halls",
        localityId: motiNagar.id,
        vegetarian: 1,
        nonVegetarian: 0,
        minBudget: 600,
        maxBudget: 1500,
        created_at: new Date(),
      },
    ],
  })

  console.log("✔️ Listings seeded")
}

async function main() {
  await seedLocations()
  await seedListings()
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })

const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

const locations = [
  { location: "Moti Nagar", city: "Delhi" },
  { location: "Kirti Nagar", city: "Delhi" },
  { location: "Uttam Nagar", city: "Delhi" },
  { location: "Punjabi Bagh", city: "Delhi" },
  { location: "Hari Nagar", city: "Delhi" },
  { location: "Ramesh Nagar", city: "Delhi" },
  { location: "Loha Mandi", city: "Delhi" },
  { location: "Malviya Nagar", city: "Delhi" },
  { location: "Mahipalpur", city: "Delhi" },
  { location: "Mayapuri", city: "Delhi" },
  { location: "Janakpuri", city: "Delhi" },
  { location: "Dabri", city: "Delhi" },
  { location: "Udyog Nagar", city: "Delhi" },
  { location: "Paschim Vihar", city: "Delhi" },
  { location: "Pitampura", city: "Delhi" },
  { location: "Britannia Chowk", city: "Delhi" },
  { location: "Karol Bagh", city: "Delhi" },
  { location: "East Of Kailash", city: "Delhi" },
  { location: "Peeragarhi", city: "Delhi" },
  { location: "Subhash Nagar", city: "Delhi" },
  { location: "Tilak Nagar", city: "Delhi" },
  { location: "Najafgarh", city: "Delhi" },
  { location: "Bijwasan", city: "Delhi" },
  { location: "Lawrence Road", city: "Delhi" },
  { location: "Mehrauli", city: "Delhi" },
  { location: "Gk 1", city: "Delhi" },
  { location: "Saket", city: "Delhi" },
  { location: "Wazirpur", city: "Delhi" },
  { location: "Dwarka", city: "Delhi" },
  { location: "Rajouri Garden", city: "Delhi" },
  { location: "Vikaspuri", city: "Delhi" },
  { location: "Naraina", city: "Delhi" },
  { location: "Patel Nagar", city: "Delhi" },
  { location: "Rajendra Nagar", city: "Delhi" },
  { location: "Chattarpur", city: "Delhi" },
  { location: "Gt Karnal Road", city: "Delhi" },
  { location: "Sector 14", city: "Delhi" },
  { location: "Sohna Road", city: "Delhi" },
  { location: "Sector 24", city: "Gurugram" },
  { location: "Manesar", city: "Gurugram" },
  { location: "Najafgarh Road Industrial Area", city: "Delhi" },
]

async function main() {
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

  console.log("Locations seeded successfully!")
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })

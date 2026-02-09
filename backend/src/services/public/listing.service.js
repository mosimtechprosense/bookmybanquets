const prisma = require("../../config/db.js")
const slugify = require("slugify")
const { mapFoodPrices } = require("../../utils/foodPriceMapper.js")

// venue images url builder function
const BASE_URL = process.env.BASE_URL || "http://localhost:5000"

const normalize = (value) => {
  if (!value) return undefined
  return value.replace(/-/g, " ").toLowerCase()
}

const buildImageURL = (image) => `${BASE_URL}/${image}`

const formatImages = (venue_images = []) => {
  return venue_images.map((img) => ({
    ...img,
    image_url: buildImageURL(img.image)
  }))
}

// CREATE — Add new listing
const createListingDB = async (data) => {
  const slug = slugify(data.title, { lower: true }) + "-" + Date.now()

  const excerpt = data.description
    ? data.description.slice(0, 150)
    : "No description available"

  const listing = await prisma.listings.create({
    data: {
      ...data,
      slug,
      excerpt
    },
    include: {
      venue_images: true,
      listing_food_categories: true
    }
  })

  const { vegPrice, nonVegPrice } = mapFoodPrices(
    listing.listing_food_categories
  )

  return {
    ...listing,
    vegPrice,
    nonVegPrice,
    venue_images: formatImages(listing.venue_images)
  }
}

const getCityVariants = (city) => {
  if (!city) return []

  const normalized = city.toLowerCase()

  const cityMap = {
    delhi: [
      "delhi",
      "north delhi",
      "south delhi",
      "east delhi",
      "west delhi",
      "new delhi",
      "West Delhi",
      "South West Delhi",
      "North Delhi",
      "New Delhi",
      "Central Delhi",
      "South Delhi",
      "East Delhi",
      "North East Delhi"
    ],
    gurgaon: ["gurgaon", "gurugram"],
    gurugram: ["gurgaon", "gurugram"]
  }

  return cityMap[normalized] || [normalized]
}

// READ — Get all listings (with filters)
const getAllListingDB = async (filters = {}, skip = 0, take = 999) => {
  const {
    mealType,
    city,
    locality,
    minGuests,
    maxGuests,
    minBudget,
    maxBudget,
    venueType,
    category,
    recommended,
    highDemand,
    search,
    sortBy = "created_at",
    order = "desc"
  } = filters

  const recommendedBool = recommended === "true" || recommended === true
  const highDemandBool = highDemand === "true" || highDemand === true

  const normalizedLocality = normalize(locality)
  const cityVariants = getCityVariants(city)

  const where = {
    status: true,

    ...(search
      ? {
          OR: [
            { title: { contains: search } },
            { city: { contains: search } },
            { locality: { contains: search } },
            { description: { contains: search } }
          ]
        }
      : {}),

    ...(category
      ? {
          listing_categories: {
            some: { listing_category_id: Number(category) }
          }
        }
      : {}),

    ...(cityVariants.length
      ? {
          OR: cityVariants.map((c) => ({
            city: { contains: c }
          }))
        }
      : {}),

    ...(locality
      ? {
          locality: { contains: String(normalizedLocality) }
        }
      : {}),

    ...(minGuests || maxGuests
      ? {
          AND: [
            minGuests ? { min_guest: { gte: Number(minGuests) } } : {},
            maxGuests ? { max_guest: { lte: Number(maxGuests) } } : {}
          ].filter(Boolean)
        }
      : {}),

    ...(minBudget || maxBudget
      ? {
          AND: [
            minBudget ? { min_budget: { gte: Number(minBudget) } } : {},
            maxBudget ? { max_budget: { lte: Number(maxBudget) } } : {}
          ].filter(Boolean)
        }
      : {}),

    ...(venueType
      ? {
          OR: [
            { keywords: { contains: venueType, mode: "insensitive" } },
            { description: { contains: venueType, mode: "insensitive" } },
            { title: { contains: venueType, mode: "insensitive" } }
          ]
        }
      : {}),

    ...(mealType === "veg"
      ? {
          listing_food_categories: {
            none: { food_category_id: 2 }
          }
        }
      : {}),

    ...(mealType === "nonVeg"
      ? {
          listing_food_categories: {
            some: { food_category_id: 2 }
          }
        }
      : {}),

    ...(recommendedBool ? { recommended: true } : {}),
    ...(highDemandBool ? { high_demand: true } : {})
  }

  const orderBy =
    sortBy === "min_budget" ||
    sortBy === "max_budget" ||
    sortBy === "created_at"
      ? { [sortBy]: order === "asc" ? "asc" : "desc" }
      : { created_at: "desc" }

  const listings = await prisma.listings.findMany({
    where,
    skip: Number(skip),
    take: Number(take),
    orderBy,
    include: {
      venue_images: true,
      listing_food_categories: true
    }
  })

  const totalCount = await prisma.listings.count({ where })

  const updatedListings = listings.map((listing) => {
    const { vegPrice, nonVegPrice } = mapFoodPrices(
      listing.listing_food_categories
    )

    return {
      ...listing,
      vegPrice,
      nonVegPrice,
      venue_images: formatImages(listing.venue_images)
    }
  })

  return { listings: updatedListings, totalCount }
}

// READ — Get single listing by ID
const getListingByIdDB = async (id) => {
  const listing = await prisma.listings.findUnique({
    where: { id: BigInt(id) },
    include: {
      venue_images: true,
      hall_capacities: true,
      listing_food_categories: true,
      faqs: {
        where: { isActive: true },
        orderBy: { order: "asc" }
      }
    }
  })

  if (!listing) return null

  const { vegPrice, nonVegPrice } = mapFoodPrices(
    listing.listing_food_categories
  )

  return {
    ...listing,
    vegPrice,
    nonVegPrice,
    venue_images: formatImages(listing.venue_images)
  }
}

// READ — Get similar listing
const getSimilarListingsDB = async (id) => {
  let listingId
  try {
    listingId = BigInt(id)
  } catch {
    console.error("Invalid listing ID:", id)
    return []
  }

  const currentListing = await getListingByIdDB(id)
  if (!currentListing) return []

  const { listings } = await getAllListingDB(
    { city: currentListing.city },
    0,
    8
  )

  return listings.filter((listing) => listing.id !== listingId)
}

// UPDATE — Modify listing
const updateListingDB = async (id, data) => {
  const listing = await prisma.listings.update({
    where: { id: BigInt(id) },
    data,
    include: {
      venue_images: true,
      listing_food_categories: true
    }
  })

  const { vegPrice, nonVegPrice } = mapFoodPrices(
    listing.listing_food_categories
  )

  return {
    ...listing,
    vegPrice,
    nonVegPrice,
    venue_images: formatImages(listing.venue_images)
  }
}

// DELETE — Soft delete
const deleteListingDB = async (id) => {
  const listing = await prisma.listings.update({
    where: { id: BigInt(id) },
    data: { status: false },
    include: { venue_images: true }
  })

  return {
    ...listing,
    venue_images: formatImages(listing.venue_images)
  }
}

// RECOMMENDED LISTINGS
const getRecommendedListingsDB = async (limit, city, locality) => {
  const filters = {
    recommended: true,
    ...(city ? { city } : {}),
    ...(locality ? { locality } : {})
  }

  const { listings } = await getAllListingDB(filters, 0, limit)
  return listings
}

// HIGH DEMAND LISTINGS
const getHighDemandListingsDB = async (limit = 10, city, locality) => {
  const filters = {
    highDemand: true,
    ...(city ? { city } : {}),
    ...(locality ? { locality } : {})
  }

  const { listings } = await getAllListingDB(filters, 0, limit)
  return listings
}

module.exports = {
  createListingDB,
  getAllListingDB,
  getListingByIdDB,
  getSimilarListingsDB,
  updateListingDB,
  deleteListingDB,
  getRecommendedListingsDB,
  getHighDemandListingsDB
}

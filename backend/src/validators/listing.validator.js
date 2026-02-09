const { z } = require("zod");


// CREATE LISTING VALIDATION
const createListingSchema = {
  body: z.object({
    title: z.string().min(3, "Title must be at least 3 chars"),

    excerpt: z.string().min(10),
    description: z.string().min(20),
    keywords: z.string().optional(),

    address: z.string().min(5),

    city: z.string().min(2),
    state: z.string(),
    country: z.string(),

    pincode: z.string().regex(/^\d{6}$/, "Invalid pincode"),

    min_budget: z.string().transform(Number),
    max_budget: z.string().transform(Number),
    min_guest: z.string().transform(Number),
    max_guest: z.string().transform(Number),

    phone: z.string().optional(),
    email: z.string().email().optional(),
    locality: z.string().optional(),

    lat: z.string().optional().transform(Number).optional(),
    long: z.string().optional().transform(Number).optional(),

    features: z.string().optional(),
    policies: z.string().optional(),

    recommended: z.boolean().optional(),
    popular: z.boolean().optional(),
    trending: z.boolean().optional(),
    high_demand: z.boolean().optional(),
    status: z.boolean().optional(),
  }),
};


// FILTER LISTINGS (GET /api/listings)
const filterListingSchema = {
  query: z.object({
    city: z.string().optional(),
    locality: z.string().optional(),

    minGuests: z.string().optional(),
    maxGuests: z.string().optional(),

    minBudget: z.string().optional(),
    maxBudget: z.string().optional(),

    recommended: z.enum(["true", "false"]).optional(),
    highDemand: z.enum(["true", "false"]).optional(),
    vegetarian: z.enum(["true", "false"]).optional(),

    venueType: z.string().optional(),

    status: z.enum(["true", "false"]).optional(),

    sortBy: z.enum(["created_at", "min_budget", "max_budget"]).optional(),
    order: z.enum(["asc", "desc"]).optional(),
  }),
};


// ID PARAM VALIDATION
const idParamSchema = {
  params: z.object({
    id: z.string().regex(/^\d+$/, "ID must be numeric"),
  }),
};


module.exports = {
  createListingSchema,
  filterListingSchema,
  idParamSchema,
};

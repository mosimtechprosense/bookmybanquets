const { Router } = require("express");
const {
  createListing,
  getAllListing,
  getListingById,
  updateListing,
  deleteListing,
  getRecommendedListings,
  getHighDemandListings,
  getSimilarListings,
} = require("../../controllers/public/listing.controller");

const {
  createListingSchema,
  filterListingSchema,
  idParamSchema,
} = require("../../validators/listing.validator");

const { validator } = require("../../middlewares/validator");

const router = Router();

//* Listing Routes

// Other Routes
router.get("/recommended", getRecommendedListings);
router.get("/high-demand", getHighDemandListings);

// CRUD
router.post("/", createListing);
router.get("/", getAllListing);
router.get("/:id/similar", getSimilarListings);
router.get("/:id", getListingById);
router.put("/:id", updateListing);
router.delete("/:id", deleteListing);

module.exports = router;

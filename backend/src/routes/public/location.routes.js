const { Router } = require("express");
const {
  getAllLocations,
  createLocation,
  updateLocation,
  deleteLocation,
} = require("../../controllers/public/location.controller");

const router = Router();

// get all locations or by ?city=Delhi
router.get("/", getAllLocations);

// add new location
router.post("/", createLocation);

// update location
router.put("/:id", updateLocation);

// delete location
router.delete("/:id", deleteLocation);

module.exports = router;

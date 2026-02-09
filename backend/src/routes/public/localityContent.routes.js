const express = require("express");
const {
  createLocalityContent,
  getAllLocalityContent,
  getLocalityContentById,
  updateLocalityContent,
  deleteLocalityContent,
  getLocalitySeoBySlug,
} = require("../../controllers/public/localityContent.controller");

const router = express.Router();

// Admin CRUD
router.post("/locality-content", createLocalityContent);
router.get("/locality-content", getAllLocalityContent);
router.get("/locality-content/:id", getLocalityContentById);
router.put("/locality-content/:id", updateLocalityContent);
router.delete("/locality-content/:id", deleteLocalityContent);

// SEO
router.get("/seo/locality/:slug", getLocalitySeoBySlug);

module.exports = router;

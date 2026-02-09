const express = require("express");

const listingRoutes = require("./public/listing.routes");
const locationRoutes = require("./public/location.routes");
const localityContentRoutes = require("./public/localityContent.routes");
const contactRoutes = require("./public/contact.routes");

const adminAuthRoutes = require("./admin/auth.routes");
const adminUserRoutes = require("./admin/user.routes");
const dashboardRoutes = require("./admin/dashboard.routes");
const adminLeadRoutes = require("./admin/lead.routes");
const adminTaskRoutes = require("./admin/task.routes");

const router = express.Router();

// public routes
router.use("/listings", listingRoutes);
router.use("/locations", locationRoutes);
router.use("/localities", localityContentRoutes);
router.use("/contact", contactRoutes);

// admin routes
router.use("/admin/auth", adminAuthRoutes);
router.use("/admin/users", adminUserRoutes);
router.use("/admin/dashboard", dashboardRoutes);
router.use("/admin/leads", adminLeadRoutes);
router.use("/admin/tasks", adminTaskRoutes);

module.exports = router;

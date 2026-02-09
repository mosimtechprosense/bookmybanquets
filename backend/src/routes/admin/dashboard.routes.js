const express = require("express");
const { auth } = require("../../middlewares/admin/auth.middleware");
const { allowRoles } = require("../../middlewares/admin/user.middleware");
const { getDashboardStats } = require("../../controllers/admin/dashboard.controller");

const router = express.Router();

router.get(
  "/stats",
  auth,
  allowRoles("ADMIN", "SUPER_ADMIN"),
  getDashboardStats
);

module.exports = router;

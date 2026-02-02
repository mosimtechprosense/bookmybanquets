import express from "express";
import { auth } from "../../middlewares/admin/auth.middleware.js";
import { allowRoles } from "../../middlewares/admin/user.middleware.js";
import { getDashboardStats } from "../../controllers/admin/dashboard.controller.js";

const router = express.Router();

router.get(
  "/stats",
  auth,
  allowRoles("ADMIN", "SUPER_ADMIN"),
  getDashboardStats
);

export default router;

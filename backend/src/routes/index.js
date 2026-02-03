import express from "express";
import listingRoutes from "./public/listing.routes.js"
import locationRoutes from "./public/location.routes.js"
import localityContentRoutes from "./public/localityContent.routes.js";
import contactRoutes from "./public/contact.routes.js"
import adminAuthRoutes from "./admin/auth.routes.js";
import adminUserRoutes from "./admin/user.routes.js";
import dashboardRoutes from "./admin/dashboard.routes.js";
import adminLeadRoutes from "./admin/lead.routes.js";
import adminTaskRoutes from "./admin/task.routes.js";



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


export default router;
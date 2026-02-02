import express from "express";
import { auth } from "../../middlewares/admin/auth.middleware.js";
import { allowRoles } from "../../middlewares/admin/user.middleware.js";
import { createUserController, listUsersController, updateUserController, deleteUserController, adminResetPasswordController, getUserByIdController } from "../../controllers/admin/user.controller.js";

const router = express.Router();

// Protect EVERYTHING below
router.use(auth);
router.use(allowRoles("ADMIN", "SUPER_ADMIN"));


router.get("/", listUsersController);
router.post("/", createUserController);
router.get("/:id", getUserByIdController);
router.put("/:id", updateUserController);
router.put("/:id/reset-password", adminResetPasswordController);
router.delete("/:id", deleteUserController);

export default router;

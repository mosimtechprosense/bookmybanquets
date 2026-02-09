const express = require("express");
const { auth } = require("../../middlewares/admin/auth.middleware");
const { allowRoles } = require("../../middlewares/admin/user.middleware");
const {
  createUserController,
  listUsersController,
  updateUserController,
  deleteUserController,
  adminResetPasswordController,
  getUserByIdController,
} = require("../../controllers/admin/user.controller");

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

module.exports = router;

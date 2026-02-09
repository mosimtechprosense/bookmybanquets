const express = require("express");
const {
  loginRequestOTP,
  verifyLoginOTPController,
  requestPasswordResetController,
  resetPasswordController,
  loginWithPassword,
} = require("../../controllers/admin/auth.controller");

const router = express.Router();

// --- LOGIN FLOW ---
router.post("/login-password", loginWithPassword); // password login
router.post("/login", loginRequestOTP);            // Admin OTP request
router.post("/verify-otp", verifyLoginOTPController);

// --- PASSWORD RESET FLOW ---
router.post("/password-reset/request", requestPasswordResetController);
router.post("/password-reset/verify", resetPasswordController);

module.exports = router;

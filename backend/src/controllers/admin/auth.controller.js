const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
  requestLoginOTP,
  verifyLoginOTP,
  requestPasswordReset,
  resetPassword,
} = require("../../services/admin/auth.service");

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// LOGIN WITH PASSWORD (for users and admins)
const loginWithPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Find user/admin
    const user = await prisma.admins.findUnique({ where: { email } });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid email or password" });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Invalid email or password" });
    }

    // OTP required for both SUPER_ADMIN and ADMIN
    if (user.role === "SUPER_ADMIN" || user.role === "ADMIN") {
      return res.json({ admin: true, message: "OTP required" });
    }

    // Normal users → no OTP, issue JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// --- LOGIN (REQUEST OTP) ---
const loginRequestOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await prisma.admins.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // OTP only for SUPER_ADMIN and ADMIN
    if (user.role === "SUPER_ADMIN" || user.role === "ADMIN") {
      await requestLoginOTP(email);
      return res.json({ message: "Login OTP sent to email" });
    }

    res.status(400).json({ message: "Normal users do not require OTP" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// --- VERIFY LOGIN OTP ---
const verifyLoginOTPController = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await prisma.admins.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Only SUPER_ADMIN and ADMIN require OTP
    if (user.role === "SUPER_ADMIN" || user.role === "ADMIN") {
      // Verify OTP via service
      const verifiedUser = await verifyLoginOTP(email, otp);

      // Sign JWT
      const token = jwt.sign(
        {
          id: verifiedUser.id,
          role: verifiedUser.role,
          full_access: verifiedUser.role === "SUPER_ADMIN",
        },
        process.env.JWT_SECRET,
        { expiresIn: "8h" }
      );

      return res.json({
        token,
        role: verifiedUser.role,
        full_access: verifiedUser.role === "SUPER_ADMIN",
        message: `${verifiedUser.role} logged in successfully`,
      });
    }

    res.status(400).json({ message: "Normal users do not require OTP" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// --- PASSWORD RESET ---
const requestPasswordResetController = async (req, res) => {
  try {
    const { email } = req.body;
    await requestPasswordReset(email);
    res.json({ message: "Password reset OTP sent to email" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const resetPasswordController = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    await resetPassword(email, otp, newPassword);
    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  loginWithPassword,
  loginRequestOTP,
  verifyLoginOTPController,
  requestPasswordResetController,
  resetPasswordController,
};

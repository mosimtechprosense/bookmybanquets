const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();


/**
 * Sign a JWT token
 * @param {Object} payload - data to include in the token (e.g., { id, role })
 * @param {string} expiresIn - token expiry time (e.g., '8h')
 * @returns {string} signed JWT
 */
const signToken = (payload, expiresIn = "8h") => {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET not set in .env");
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

/**
 * Verify a JWT token
 * @param {string} token - JWT from client
 * @returns {Object} decoded payload
 */
const verifyToken = (token) => {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET not set in .env");
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {
  signToken,
  verifyToken,
};

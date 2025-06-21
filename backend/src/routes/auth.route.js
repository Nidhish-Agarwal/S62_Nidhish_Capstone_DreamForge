const express = require("express");

// Middleware to verify the access token
const verifyJWT = require("../middlewares/verifyJWT.js");

const router = express.Router();
const {
  changePassword,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth.controller.js");
const forgotPasswordLimiter = require("../middlewares/rateLimiter.js");

router.put("/change_password", verifyJWT, changePassword);
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;

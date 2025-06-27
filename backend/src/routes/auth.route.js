const express = require("express");

// Middleware to verify the access token
const verifyJWT = require("../middlewares/verifyJWT.js");

const router = express.Router();
const {
  changePassword,
  forgotPassword,
  resetPassword,
  googleLogin,
  logout,
  logoutAllSessions,
  registerUser,
  loginUser,
  getActiveSessions,
  logoutSessionById,
} = require("../controllers/auth.controller.js");
const forgotPasswordLimiter = require("../middlewares/rateLimiter.js");

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.put("/change_password", verifyJWT, changePassword);
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/google-login", googleLogin);
router.get("/logout", logout);
router.get("/logout-all", logoutAllSessions);
router.get("/sessions", verifyJWT, getActiveSessions);
router.delete("/sessions/:sessionId", verifyJWT, logoutSessionById);
router.delete("/sessions", verifyJWT, logoutAllSessions);

module.exports = router;

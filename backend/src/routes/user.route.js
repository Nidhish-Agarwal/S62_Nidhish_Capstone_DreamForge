const express = require("express");

// Middleware to verify the access token
const verifyJWT = require("../middlewares/verifyJWT.js");

// Middleware to verify the role of the user
const verifyRoles = require("../middlewares/verifyRoles.js");

const ROLES_LIST = require("../config/roles_list.js");

const router = express.Router();

const {
  registerUser,
  loginUser,
  fetchAllUsers,
  handleLogout,
  fetchUserData,
  updateUserProfile,
  changePassword,
} = require("../controllers/user.controller.js");
const {
  handleProfilePictureUpload,
} = require("../middlewares/uploadMiddleware.js");

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/", verifyJWT, verifyRoles(ROLES_LIST.Admin), fetchAllUsers);
router.get("/logout", handleLogout);
router.get("/get_user_data", verifyJWT, fetchUserData);
router.put("/update", verifyJWT, handleProfilePictureUpload, updateUserProfile);
router.put("/change-password", verifyJWT, changePassword);

module.exports = router;

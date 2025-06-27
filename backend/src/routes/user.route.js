const express = require("express");

// Middleware to verify the access token
const verifyJWT = require("../middlewares/verifyJWT.js");

// Middleware to verify the role of the user
const verifyRoles = require("../middlewares/verifyRoles.js");

const ROLES_LIST = require("../config/roles_list.js");

const router = express.Router();

const {
  fetchAllUsers,
  fetchUserData,
  updateUserProfile,
  sendFeedback,
} = require("../controllers/user.controller.js");
const {
  handleProfilePictureUpload,
} = require("../middlewares/uploadMiddleware.js");

router.get("/", verifyJWT, verifyRoles(ROLES_LIST.Admin), fetchAllUsers);
router.get("/get_user_data", verifyJWT, fetchUserData);
router.put("/update", verifyJWT, handleProfilePictureUpload, updateUserProfile);

router.post("/feedback", verifyJWT, sendFeedback);

module.exports = router;

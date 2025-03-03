const express = require("express");
const { addRawDream } = require("../controllers/dream.controller.js");

// Middleware to verify the access token
const verifyJWT = require("../middlewares/verifyJWT.js");

const router = express.Router();

router.post("/", verifyJWT, addRawDream);

module.exports = router;

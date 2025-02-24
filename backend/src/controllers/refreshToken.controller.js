const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/user.model.js");

// Function to check if the refreshToken in the cookie is valid and then returning a new access token

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;

  //   Checking if the jwt exists in the cookie
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;

  //   Finding a user with the same refreshToken as in the cookie
  const foundUser = await User.findOne({ refreshToken: refreshToken });

  if (!foundUser) return res.sendStatus(403); // Forbidden

  // Verifying the refresh token

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || decoded.userId != foundUser._id) return res.sendStatus(403);

    // If everthing is valid make a new access token to send
    const userId = foundUser._id;
    const roles = foundUser.roles;
    const accessToken = jwt.sign(
      { userId, roles },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    // Sending the access token
    res.json({ userId, roles, accessToken });
  });
};

module.exports = { handleRefreshToken };

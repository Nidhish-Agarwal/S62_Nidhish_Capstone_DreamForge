const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/user.model.js");

// Function to check if the refreshToken in the cookie is valid and then returning a new access token
const handleRefreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.jwt;
    if (!refreshToken) return res.sendStatus(401); // Unauthorized

    // Find user with matching session token
    const user = await User.findOne({ "sessions.refreshToken": refreshToken });
    if (!user) return res.sendStatus(403); // Forbidden

    // Find the matching session
    const session = user.sessions.find((s) => s.refreshToken === refreshToken);
    if (!session) return res.sendStatus(403);

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err || decoded.userId !== user._id.toString()) {
          console.error("JWT verification failed:", err?.message);
          return res.sendStatus(403);
        }

        // Update session usage
        session.lastUsed = new Date();
        await user.save();

        const accessToken = jwt.sign(
          { userId: user._id, roles: user.roles },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "15m" }
        );

        res.status(200).json({
          accessToken,
          userId: user._id,
          roles: user.roles,
        });
      }
    );
  } catch (err) {
    console.error("❌ Error in handleRefreshToken:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { handleRefreshToken };

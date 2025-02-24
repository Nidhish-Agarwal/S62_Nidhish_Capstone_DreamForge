const jwt = require("jsonwebtoken");
require("dotenv").config();

// Creating a middleware to verify the access token each time

const verifyJWT = (req, res, next) => {
  // Getting the authorization header to check the access token
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.sendStatus(401);
  }

  // Auth is in form 'Bearer Token'

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(401); // invalid token

    // If token is valid put the value of userId and roles to be used by the other routes
    req.userId = decoded.userId;
    req.roles = decoded.roles;

    // While making custom middleware using next() to continue the further code
    next();
  });
};

module.exports = verifyJWT;

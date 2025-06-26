require("dotenv").config();

const allowedOrigins = [process.env.FRONTEND_URL, process.env.BACKEND_URL];

module.exports = allowedOrigins;

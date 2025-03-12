if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config();
}

const http = require("http");
const connectDatabase = require("./DB/database.js");
const app = require("./app.js");

// Create an HTTP server using Express
const server = http.createServer(app);

// Initialize database connection
connectDatabase();

// Pass the server instance to socket.js
require("./socket.js")(server);

// Define the port
const PORT = process.env.PORT || 5000;

// Start the server (Express + Socket.IO)
server.listen(PORT, () => {
  console.log(
    `Server is running on Port:${PORT} URL: http://localhost:${PORT}`
  );
});

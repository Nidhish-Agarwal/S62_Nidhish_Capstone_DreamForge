const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

// Define your allowed origins for CORS
const allowedOrigins = require("./config/allowedOrigins.js");

let io;

module.exports = (server) => {
  io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
      console.log("No token provided in socket connection");
      socket.disconnect(true);
      return;
    }

    try {
      const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
      socket.userId = decoded.userId;

      console.log("Socket connected for user:", socket.userId);

      // Join user-specific room (useful for sending events only to this user)
      socket.join(socket.userId);

      // Example event listeners - you can extend these
      socket.on("some-event", (data) => {
        console.log(`Received some-event from user ${socket.userId}`, data);
        // do something with data
      });

      socket.on("disconnect", (reason) => {
        console.log(`Client disconnected: ${socket.id}, reason: ${reason}`);
      });
    } catch (err) {
      console.log("Socket auth failed:", err.message);
      // Inform client about auth failure
      socket.emit("auth_error", new Error("jwt expired"));
      socket.disconnect(true);
    }
  });

  return io;
};

module.exports.getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

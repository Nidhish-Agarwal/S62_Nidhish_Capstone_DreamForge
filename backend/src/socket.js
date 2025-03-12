const { Server } = require("socket.io");
const allowedOrigins = require("./config/allowedOrigins");

let io; // Declare io globally

module.exports = (server) => {
  io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  // Export io after initialization
  module.exports.io = io;
};

// Export a function to get io instance safely
module.exports.getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};

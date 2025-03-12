const { getIO } = require("../socket.js");

const emitDreamUpdate = (dreamId, update) => {
  try {
    const io = getIO(); // Get io safely
    io.emit("dream-updated", { _id: dreamId, ...update });
  } catch (error) {
    console.error("Socket.io not initialized yet:", error.message);
  }
};

module.exports = { emitDreamUpdate };

const { getIO } = require("../socket.js");

const emitDreamUpdate = (userId, dreamId, update) => {
  try {
    const io = getIO(); // Get io safely
    io.to(userId).emit("dream-updated", { _id: dreamId, ...update });
  } catch (error) {
    console.error("Socket.io not initialized yet:", error.message);
  }
};

const emitProcessedDreamUpdate = (userId, dreamId, processedDreamUpdate) => {
  try {
    const io = getIO();
    io.to(userId).emit("processed-dream-updated", {
      _id: dreamId.toString(),
      ...processedDreamUpdate,
    });
  } catch (error) {
    console.error("Socket.io not initialized yet:", error.message);
  }
};

module.exports = { emitDreamUpdate, emitProcessedDreamUpdate };

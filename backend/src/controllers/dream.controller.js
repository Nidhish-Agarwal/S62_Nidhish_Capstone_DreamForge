const RawDream = require("../models/rawDream.model.js"); // Adjust the path as necessary
const User = require("../models/user.model.js"); // Import User model
const mongoose = require("mongoose");

const addRawDream = async (req, res) => {
  try {
    const { title, description, emotions, dreamType, date } = req.body;
    const userId = req.userId;

    // Validate required fields
    if (!userId || !description || !date) {
      return res
        .status(400)
        .json({ error: "User ID, description, and date are required." });
    }

    // Ensure user_id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID." });
    }

    // Check if user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ error: "User not found." });
    }

    // Validate emotions as an array
    if (emotions && !Array.isArray(emotions)) {
      return res.status(400).json({ error: "Emotions should be an array." });
    }

    // Validate date format
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ error: "Invalid date format." });
    }

    // Create and save the dream entry
    const newDream = new RawDream({
      user_id: userId,
      title,
      description,
      emotions,
      dream_type: dreamType,
      date: parsedDate,
    });

    const savedDream = await newDream.save();
    res.status(201).json(savedDream);
  } catch (error) {
    console.error("Error saving dream:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

module.exports = { addRawDream };

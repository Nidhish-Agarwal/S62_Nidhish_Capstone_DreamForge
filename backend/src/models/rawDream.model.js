const mongoose = require("mongoose");

const rawDreamSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    title: {
      type: String,
      trim: true,
      default: "", // Optional field
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    emotions: {
      type: [String],
      default: [], // Array of emotions
    },
    dream_type: {
      type: String,
      trim: true,
      default: "", // Optional field
    },
    date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// Index for faster lookups by user_id
rawDreamSchema.index({ user_id: 1 });

const RawDream = mongoose.model("RawDream", rawDreamSchema);

module.exports = RawDream;

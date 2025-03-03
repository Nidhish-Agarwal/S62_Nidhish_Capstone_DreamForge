const mongoose = require("mongoose");

const processedDreamSchema = new mongoose.Schema(
  {
    dream_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RawDream", // Reference to the RawDream model
      required: true,
    },
    sentiment: {
      positive: {
        type: Number,
        min: 0,
        max: 100,
        required: true,
      },
      negative: {
        type: Number,
        min: 0,
        max: 100,
        required: true,
      },
      neutral: {
        type: Number,
        min: 0,
        max: 100,
        required: true,
      },
    },
    keywords: {
      type: [String],
      default: [], // Array of keywords
    },
    interpretation: {
      type: String,
      required: true,
      trim: true,
    },
    image_prompt: {
      type: String,
      trim: true,
      default: "", // Optional field
    },
    video_prompt: {
      type: String,
      trim: true,
      default: "", // Optional field
    },
    analysis_version: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

// Index for faster lookups by dream_id
processedDreamSchema.index({ dream_id: 1 });

const ProcessedDream = mongoose.model("ProcessedDream", processedDreamSchema);

module.exports = ProcessedDream;

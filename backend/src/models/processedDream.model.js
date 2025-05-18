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
    analysis_version: {
      type: String,
      required: true,
      trim: true,
    },
    image_status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },
    image_url: String,
    image_retry_count: { type: Number, default: 0, max: 3 },
    image_generation_attempts: [
      { status: String, error: String, timestamp: Date },
    ],
    image_is_retrying: {
      type: Boolean,
      default: false,
    },

    processed_at: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Index for faster lookups by dream_id
processedDreamSchema.index({ dream_id: 1 });

const ProcessedDream = mongoose.model("ProcessedDream", processedDreamSchema);

module.exports = ProcessedDream;

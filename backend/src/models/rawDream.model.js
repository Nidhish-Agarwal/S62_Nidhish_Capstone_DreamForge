const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

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
    analysis_status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },
    retry_count: {
      type: Number,
      default: 0,
      max: 3,
    },
    last_processed_at: Date,
    analysis_attempts: [
      {
        timestamp: Date,
        status: String,
        error: String,
      },
    ],
    isLiked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index for faster lookups by user_id
rawDreamSchema.index({ user_id: 1 });

// Adding pagination plugin
rawDreamSchema.plugin(mongoosePaginate);

const RawDream = mongoose.model("RawDream", rawDreamSchema);

module.exports = RawDream;

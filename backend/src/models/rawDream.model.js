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
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    mood: {
      type: String,
      enum: ["Terrified", "Sad", "Neutral", "Happy", "Euphoric"],
      deafult: "Neutral",
    },
    intensity: {
      type: Number,
      min: 0,
      max: 100,
      default: 50,
    },

    symbols: {
      type: [String],
      default: [],
    },

    themes: {
      type: [String],
      default: [],
    },

    characters: {
      type: [String],
      default: [],
    },

    setting: {
      type: [String],
      default: [],
    },

    notes_to_ai: {
      type: String,
      default: "",
    },

    real_life_link: {
      type: String,
      default: "",
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
    analysis_is_retrying: {
      type: Boolean,
      default: false,
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

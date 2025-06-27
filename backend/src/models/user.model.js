const mongoose = require("mongoose");
const ROLES_LIST = require("../config/roles_list.js");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    roles: {
      type: [Number],
      enum: Object.values(ROLES_LIST),
      default: [ROLES_LIST.User],
    },
    profileImage: {
      type: String, // URL of the uploaded profile picture (optional)
    },
    bio: {
      type: String, // Short user bio (optional)
    },
    dreamCount: {
      type: Number,
      default: 0, // Number of dreams logged
    },
    lastDreamDate: {
      type: Date, // Stores the date of the user's last dream entry
    },
    maxDreamStreak: {
      type: Number,
      default: 0, // Consecutive days of dream logging
    },
    refreshToken: {
      type: String, // Stores the hashed refresh token for authentication
    },
    sessions: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          default: () => new mongoose.Types.ObjectId(),
        },
        refreshToken: String,
        deviceInfo: String,
        ipAddress: String,
        userAgent: String,
        createdAt: { type: Date, default: Date.now },
        lastUsed: { type: Date, default: Date.now },
      },
    ],
    isVerified: {
      type: Boolean,
      default: false, // Tracks if the email is verified
    },
    provider: {
      type: String,
      enum: ["local", "google", "github"],
      default: "local", // Allows social login in the future
    },
    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CommunityPost",
      },
    ], // For quick lookup of user's bookmarked posts
    likedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CommunityPost",
      },
    ], // For quick lookup of posts the user liked
    resetPasswordIssuedAt: {
      type: Date, // Timestamp for when the password reset was issued
      default: null, // Used to track password reset requests
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);

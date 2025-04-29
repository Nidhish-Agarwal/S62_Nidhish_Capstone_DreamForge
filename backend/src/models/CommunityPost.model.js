const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const CommunityPostSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dream: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RawDream",
      required: true,
    },
    // Optional: A separate title (if needed)
    title: {
      type: String,
      trim: true,
      default: "",
    },
    caption: {
      type: String,
      trim: true,
      default: "",
    },
    hashtags: [
      {
        type: String,
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    likeCount: {
      type: Number,
      default: 0,
    },
    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    bookmarkCount: {
      type: Number,
      default: 0,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    commentCount: {
      type: Number,
      default: 0,
    },
    shareCount: {
      type: Number,
      default: 0,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    editedAt: {
      type: Date,
    },
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
  },
  { timestamps: true }
);

// Optional: Index for sorting posts by creation time
CommunityPostSchema.index({ createdAt: -1 });

// Adding pagination plugin
CommunityPostSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("CommunityPost", CommunityPostSchema);

const Comment = require("../models/Comment.model.js");
const CommunityPost = require("../models/CommunityPost.model.js");
const User = require("../models/user.model.js");
const mongoose = require("mongoose");

const createCommunityPost = async (req, res) => {
  try {
    const { dreamId, caption, hashtags } = req.body;
    const userId = req.userId; // Extract user ID from request

    // Validate user ID
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User ID is missing." });
    }

    // Validate required fields
    if (!dreamId) {
      return res.status(400).json({ message: "Dream ID is required." });
    }

    // Validate hashtags (must be an array of strings)
    if (hashtags && !Array.isArray(hashtags)) {
      return res
        .status(400)
        .json({ message: "Hashtags must be an array of strings." });
    }

    // Validate caption length
    if (caption && caption.length > 500) {
      return res
        .status(400)
        .json({ message: "Caption must be under 500 characters." });
    }

    // Create a new community post
    const newPost = new CommunityPost({
      user: userId,
      dream: dreamId,
      caption: caption?.trim() || "",
      hashtags: hashtags || [],
    });

    // Save to database
    await newPost.save();

    res
      .status(201)
      .json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    console.error("Error creating post:", error);

    // Handle MongoDB validation errors
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Validation Error", errors: error.errors });
    }

    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getCommunityPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 posts per page

    const options = {
      page,
      limit,
      sort: { createdAt: -1 }, // Latest posts first
      populate: [
        { path: "user", select: "username profileImage" },
        { path: "dream", select: "title description" },
      ],
    };

    // Use the paginate method provided by the plugin
    const result = await CommunityPost.paginate({}, options);

    res.status(200).json({
      posts: result.docs,
      totalPages: result.totalPages,
      currentPage: result.page,
    });
  } catch (error) {
    console.error("Error fetching community posts:", error);
    res.status(500).json({ message: "Failed to fetch posts" });
  }
};

const handleLike = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.userId; // Extracted from auth middleware

    const post = await CommunityPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const user = await User.findById(userId); // Fetch the user
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hasLiked = post.likes.includes(userId);

    if (hasLiked) {
      // If already liked, remove like (unlike)
      post.likes = post.likes.filter((id) => id.toString() !== userId);
      post.likeCount = Math.max(0, post.likeCount - 1); // Prevent negative counts

      user.likedPosts = user.likedPosts.filter(
        (id) => id.toString() !== postId
      );
    } else {
      // If not liked, add like
      post.likes.push(userId);

      post.likeCount += 1;
      user.likedPosts.push(postId);
    }

    await post.save();

    await user.save();

    return res.json({
      success: true,
      liked: !hasLiked, // Send new like status
      likeCount: post.likeCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const handleBookmark = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.userId; // Extracted from auth middleware

    const post = await CommunityPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hasBookmarked = user.bookmarks.includes(postId);

    if (hasBookmarked) {
      // If already bookmarked, remove it
      user.bookmarks = user.bookmarks.filter((id) => id.toString() !== postId);
      post.bookmarkCount = Math.max(0, post.bookmarkCount - 1); // Prevent negative count
      post.bookmarks = post.bookmarks.filter((id) => id.toString() !== userId);
    } else {
      // If not bookmarked, add it
      user.bookmarks.push(postId);
      post.bookmarks.push(userId);
      post.bookmarkCount += 1;
    }

    await user.save();
    await post.save();

    return res.json({
      success: true,
      bookmarked: !hasBookmarked, // Send new bookmark status
      bookmarkCount: post.bookmarkCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;
    const userId = req.userId;

    const comment = new Comment({ post: postId, user: userId, text });
    await comment.save();

    await comment.populate("user", "username profileImage");

    await CommunityPost.findByIdAndUpdate(postId, {
      $push: { comments: comment._id },
      $inc: { commentCount: 1 }, // Update comment count
    });

    res.status(201).json(comment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error adding comment", error: error });
  }
};

const getAllComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sort || "latest";

    parentPost = await CommunityPost.findById(postId);

    if (!parentPost) return res.status(404).send({ message: "No post found" });

    const commentIds = parentPost.comments;

    const sortOptions = {
      latest: { createdAt: -1 },
      mostLiked: { likesCount: -1, createdAt: -1 },
      oldest: { createdAt: 1 },
    };

    const commentsResult = await Comment.paginate(
      { _id: { $in: commentIds } },
      {
        page,
        limit,
        sort: sortOptions[sortBy] || sortOptions.latest,
        populate: {
          path: "user",
          select: "username profileImage bio createdAt",
        },
        select: "-__v -updatedAt",
      }
    );

    res.json({
      comments: commentsResult.docs,
      totalPages: commentsResult.totalPages,
      currentPage: commentsResult.page,
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch comments. Please try again later." });
  }
};

const getReplies = async (req, res) => {
  try {
    const { commentId } = req.params;

    // Check if commentId exists and is a valid ObjectId
    if (!commentId || !mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ error: "Invalid or missing commentId" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5; // Smaller limit for replies

    const parentComment = await Comment.findById(commentId);

    const replyIds = parentComment.replies;

    const repliesResult = await Comment.paginate(
      { _id: { $in: replyIds } }, // Match if commentId is in the replies array
      {
        page,
        limit,
        sort: { createdAt: -1 },
        populate: {
          path: "user",
          select: "username profileImage bio createdAt",
        },
        select: "-__v -updatedAt",
      }
    );

    if (!repliesResult.docs.length) {
      return res.json({
        replies: [],
        totalPages: repliesResult.totalPages,
        currentPage: repliesResult.page,
        message: "No replies found for this comment",
      });
    }

    res.json({
      replies: repliesResult.docs,
      totalPages: repliesResult.totalPages,
      currentPage: repliesResult.page,
    });
  } catch (error) {
    console.error("Error fetching replies:", error);
    res.status(500).json({ error: "Failed to fetch replies." });
  }
};

const addReply = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;
    const userId = req.userId;

    // Check if the comment exists
    const parentComment = await Comment.findById(commentId);
    if (!parentComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Create the reply as a new comment
    const reply = new Comment({
      post: parentComment.post, // Keep the same post reference
      user: userId,
      text,
    });

    await reply.save();

    // Add reply to the parent comment
    parentComment.replies.push(reply._id);
    await parentComment.save();

    res.status(201).json({
      message: "Reply added successfully",
      replyId: reply._id,
    });
  } catch (error) {
    console.error("Error adding reply:", error);
    res.status(500).json({ message: "Error adding reply", error });
  }
};

const commentReact = async (req, res) => {
  const { reaction } = req.body; // 'like' or 'dislike'
  const { id } = req.params;
  const userId = req.userId;

  try {
    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const alreadyLiked = comment.likes.includes(userId);
    const alreadyDisliked = comment.dislikes.includes(userId);

    if (reaction === "like") {
      if (alreadyLiked) {
        comment.likes.pull(userId); // remove like
      } else {
        comment.likes.addToSet(userId); // add like
        if (alreadyDisliked) comment.dislikes.pull(userId); // remove dislike
      }
    } else if (reaction === "dislike") {
      if (alreadyDisliked) {
        comment.dislikes.pull(userId); // remove dislike
      } else {
        comment.dislikes.addToSet(userId); // add dislike
        if (alreadyLiked) comment.likes.pull(userId); // remove like
      }
    }

    await comment.save();
    return res.status(200).json({
      likes: comment.likes.length,
      dislikes: comment.dislikes.length,
      likedByUser: comment.likes.includes(userId),
      dislikedByUser: comment.dislikes.includes(userId),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createCommunityPost,
  getCommunityPosts,
  handleLike,
  handleBookmark,
  addComment,
  getAllComments,
  getReplies,
  addReply,
  commentReact,
};

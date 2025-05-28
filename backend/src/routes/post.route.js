const express = require("express");
const router = express.Router();

const {
  createCommunityPost,
  getCommunityPosts,
  handleLike,
  handleBookmark,
  addComment,
  getAllComments,
  getReplies,
  addReply,
  commentReact,
  editComment,
  deleteComment,
  editPost,
  deletePost,
} = require("../controllers/post.controller.js");
const verifyJWT = require("../middlewares/verifyJWT.js");

router.post("/post", verifyJWT, createCommunityPost);
router.get("/post", verifyJWT, getCommunityPosts);
router.put("/:postId/like", verifyJWT, handleLike);
router.put("/:postId/bookmark", verifyJWT, handleBookmark);
router.post("/:postId/comment", verifyJWT, addComment);
router.get("/:postId/comments", verifyJWT, getAllComments);
router.get("/comment/:commentId/replies", verifyJWT, getReplies);
router.post("/comment/:commentId/reply", verifyJWT, addReply);
router.put("/comment/:id/react", verifyJWT, commentReact);
router.put("/comment/:commentId", verifyJWT, editComment);
router.delete("/comment/:commentId", verifyJWT, deleteComment);
router.put("/post/:PostId", verifyJWT, editPost);
router.delete("/post/:PostId", verifyJWT, deletePost);

module.exports = router;

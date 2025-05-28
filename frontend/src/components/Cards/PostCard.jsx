import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Pencil, Trash2 } from "lucide-react";
import HeartIcon from "../icons/HeartIcon";
import BookmarkIcon from "../icons/BookmarkIcon";
import { format } from "date-fns";
import useAuth from "../../hooks/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import NoImage from "../../assets/No-Image.png";
import PostOverlay from "../PostOverlay/PostOverlay";
import DreamPersonalityTypes from "../../data/DreamPersonalityTypes.json";

const PostCard = ({ post, updatePost, onDelete }) => {
  const { user, caption, image, commentCount, createdAt, title } = post;
  const auth = useAuth();
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const liked = post.likes.includes(auth.auth.userId);
  const bookmarked = post.bookmarks.includes(auth.auth.userId);
  const isOwner = post.user._id === auth.auth.userId;

  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(post.caption);

  useEffect(() => {
    if (isOverlayOpen) {
      document.documentElement.classList.add("overlay-open");
    } else {
      document.documentElement.classList.remove("overlay-open");
    }
  }, [isOverlayOpen]);

  const onClose = () => {
    setIsOverlayOpen(false);
  };

  const dptMeta = DreamPersonalityTypes.find(
    (d) => d.id === post?.dream?.analysis?.dream_personality_type?.type
  );

  const handleLike = async () => {
    try {
      const response = await axiosPrivate.put(`community/${post._id}/like`);
      const updated = {
        ...post,
        likes: response.data.liked
          ? [...post.likes, auth.auth.userId]
          : post.likes.filter((id) => id !== auth.auth.userId),
        likeCount: response.data.likeCount,
      };
      updatePost(updated);
    } catch (error) {
      console.error("Error liking post", error);
    }
  };

  const handleBookmark = async () => {
    try {
      const response = await axiosPrivate.put(`community/${post._id}/bookmark`);
      const updated = {
        ...post,
        bookmarks: response.data.bookmarked
          ? [...post.bookmarks, auth.auth.userId]
          : post.bookmarks.filter((id) => id !== auth.auth.userId),
        bookmarkCount: response.data.bookmarkCount,
      };
      updatePost(updated);
    } catch (error) {
      console.error("Error bookmarking post", error);
    }
  };

  const handleEdit = async () => {
    try {
      if (editedText.length < 1) {
        toast.error("Length of the caption should be atleast 1 character");
        return;
      }

      const res = await axiosPrivate.put(`/community/post/${post._id}`, {
        newCaption: editedText,
      });
      const updatedPost = {
        ...post,
        caption: res.data.caption,
        isEdited: true,
      };
      updatePost(updatedPost);
      toast.success("Post updated.");
      setIsEditing(false);
    } catch (err) {
      toast.error(`Failed to update: ${err.message}`);
    }
  };

  const handleDelete = async () => {
    try {
      await axiosPrivate.delete(`/community/post/${post._id}`);
      // Remove the post from the UI
      onDelete(post._id);

      toast.success("Post deleted.");
    } catch (err) {
      toast.error(`Failed to delete Post. ${err.message}`);
    }
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        whileHover={{
          scale: 1.02,
          boxShadow: "0 0 20px rgba(255, 255, 255, 0.1)",
        }}
        className="w-full max-w-2xl"
      >
        <Card
          className="relative flex gap-2 items-center justify-between bg-gradient-to-r from-[#3a1c3f] via-[#4a254a] to-[#2c1230] text-white p-4 rounded-2xl border border-white/10 shadow-[0_0_12px_rgba(255,255,255,0.05)] hover:shadow-[0_0_20px_rgba(255,255,255,0.12)] transition-all duration-300"
          onClick={() => setIsOverlayOpen(true)}
        >
          {/* Left Side */}
          <div className="flex flex-col items-start gap-3 w-2/3">
            {/* User Info */}
            <CardHeader className="p-0 flex-row w-full">
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={user.profileImage} alt="Profile Picture" />
                  <AvatarFallback className="text-gray-600 dark:text-white font-bold text-2xl">
                    {user?.username
                      ? user.username
                          .split(" ")
                          .map((word) => word[0])
                          .join("")
                          .toUpperCase()
                      : "?"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="flex gap-2 items-center text-sm font-medium line-clamp-1 max-w-[100px] sm:max-w-[150px] md:max-w-[200px] lg:max-w-[250px] xl:max-w-xs">
                    {user.username}
                    {post.isEdited && (
                      <span className="text-xs text-muted-foreground italic">
                        (edited)
                      </span>
                    )}
                  </p>

                  <p className="text-xs text-white/70">
                    {format(new Date(createdAt), "dd MMM yyyy")}
                  </p>
                </div>
              </div>
              {isOwner && (
                <div className="ml-auto flex gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsEditing(true);
                          }}
                        >
                          <Pencil className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Edit</TooltipContent>
                    </Tooltip>

                    <Dialog>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </DialogTrigger>
                        </TooltipTrigger>
                        <TooltipContent>Delete</TooltipContent>
                      </Tooltip>

                      <DialogContent onClick={(e) => e.stopPropagation()}>
                        <div className="flex flex-col gap-4">
                          <DialogTitle className="text-lg font-semibold">
                            Confirm Delete
                          </DialogTitle>

                          <DialogDescription className="text-sm text-muted-foreground">
                            Are you sure you want to delete this Post?
                          </DialogDescription>
                          <div className="flex justify-end gap-2">
                            <DialogClose asChild>
                              <Button variant="ghost">Cancel</Button>
                            </DialogClose>
                            <DialogClose asChild>
                              <Button
                                variant="destructive"
                                onClick={handleDelete}
                              >
                                Delete
                              </Button>
                            </DialogClose>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TooltipProvider>
                </div>
              )}
            </CardHeader>

            {/* Title & Description */}
            <CardContent className="p-0 mt-2 w-full">
              {/* Dream Title if available */}
              {post.title && (
                <motion.p
                  className="text-base font-semibold mb-1 text-pink-300 tracking-wide"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {post.title}
                </motion.p>
              )}

              {/* Caption */}
              <AnimatePresence mode="wait">
                {isEditing ? (
                  <motion.div
                    key="edit-mode"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col gap-2 "
                    onClick={(e) => e.stopPropagation()}
                  >
                    <textarea
                      className="w-full p-2 text-sm border border-gray-300 text-black  rounded-md resize-none"
                      value={editedText}
                      onChange={(e) => setEditedText(e.target.value)}
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit();
                        }}
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsEditing(false);
                          setEditedText(post.caption);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="view-mode"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm text-white/80 leading-snug mb-2 line-clamp-2"
                  >
                    {post.caption}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Hashtags */}
              <div className="flex flex-wrap gap-2 ">
                {post.hashtags.map((tag, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    className="text-xs bg-white/20 px-3 py-1 rounded-full text-white font-medium backdrop-blur-sm border border-white/10 shadow-sm"
                  >
                    #{tag}
                  </motion.div>
                ))}
              </div>
            </CardContent>

            {/* Badge Row */}
            <motion.div
              className="flex flex-wrap  gap-2 mt-2 items-center"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <TooltipProvider>
                {/* 🧠 DPT */}

                {/* 🎭 Mood */}
                {post?.dream?.mood && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {post.dream?.mood && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="cursor-pointer flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full text-white text-sm backdrop-blur-md"
                        >
                          <span className="text-xl">
                            {{
                              Terrified: "😭",
                              Sad: "😔",
                              Neutral: "😐",
                              Happy: "😊",
                              Euphoric: "🤩",
                            }[post.dream.mood] || "🌙"}
                          </span>{" "}
                          {post.dream.mood}
                        </motion.div>
                      )}
                    </TooltipTrigger>
                    <TooltipContent>
                      The emotional tone you selected during dream input.
                    </TooltipContent>
                  </Tooltip>
                )}
                {dptMeta && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="cursor-pointer bg-purple-600/70 text-white px-2 py-1 rounded text-sm">
                        🧠 {dptMeta.name}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs text-sm">
                      {dptMeta.short_description}
                    </TooltipContent>
                  </Tooltip>
                )}

                {/* 🏞️ Setting */}
                {post?.dream?.setting?.map((place, i) => (
                  <Tooltip key={i}>
                    <TooltipTrigger asChild>
                      <div className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white px-2 py-1 rounded text-sm cursor-pointer">
                        {place}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>Where the dream took place.</TooltipContent>
                  </Tooltip>
                ))}

                {/* 🔮 Themes */}
                {post?.dream?.themes?.map((theme, i) => (
                  <Tooltip key={i}>
                    <TooltipTrigger asChild>
                      <div className="border border-dashed border-gray-500 px-2 py-1 rounded text-sm text-white cursor-pointer">
                        #{theme}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      Theme detected or tagged from your dream.
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </motion.div>

            {/* Stats */}
            <CardFooter className="p-0" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-4 mt-2 text-white/70">
                <TooltipProvider>
                  {/* ❤️ Like */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike();
                        }}
                        className={`flex items-center gap-1 ${
                          liked ? "text-red-400" : ""
                        }`}
                      >
                        <HeartIcon liked={liked} />
                        <span>{post.likeCount}</span>
                      </motion.button>
                    </TooltipTrigger>
                    <TooltipContent>Like this dream</TooltipContent>
                  </Tooltip>

                  {/* 💬 Comments */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="flex items-center gap-1"
                      >
                        <MessageSquare className="text-white h-5 w-5" />
                        <span>{commentCount}</span>
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent>Comments</TooltipContent>
                  </Tooltip>

                  {/* 📌 Bookmark */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookmark();
                        }}
                        className={`flex items-center gap-1 ${
                          bookmarked ? "text-yellow-400" : ""
                        }`}
                      >
                        <BookmarkIcon bookmarked={bookmarked} />
                        <span>{post.bookmarkCount}</span>
                      </motion.button>
                    </TooltipTrigger>
                    <TooltipContent>Bookmark this post</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardFooter>
          </div>

          {/* Right Side (Image) */}
          <div className="w-1/3 max-h-44">
            <img
              src={post?.dream?.analysis?.image_url || NoImage}
              alt="Dream visual"
              className="w-full max-h-44 rounded-lg object-cover transition-all duration-500 ease-in-out hover:brightness-110"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = NoImage;
              }}
            />
          </div>
        </Card>
      </motion.div>

      {isOverlayOpen && (
        <PostOverlay
          post={post}
          onClose={onClose}
          handleLike={handleLike}
          handleBookmark={handleBookmark}
          updatePost={updatePost}
          onDelete
        />
      )}
    </div>
  );
};

export default PostCard;

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
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";
import HeartIcon from "../icons/HeartIcon";
import BookmarkIcon from "../icons/BookmarkIcon";
import { format } from "date-fns";
import useAuth from "../../hooks/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import NoImage from "../../assets/No-Image.png";
import PostOverlay from "../PostOverlay/PostOverlay";

const PostCard = ({ post, updatePost }) => {
  const { user, caption, image, commentCount, createdAt, title } = post;
  const auth = useAuth();
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const liked = post.likes.includes(auth.auth.userId);
  const bookmarked = post.bookmarks.includes(auth.auth.userId);

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

  return (
    <div>
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="w-full max-w-2xl"
      >
        <Card
          className="relative flex gap-2 items-center justify-between bg-gradient-to-r from-[#3a1c3f] via-[#4a254a] to-[#2c1230] text-white p-4 rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] border border-white/10 hover:border-white/20 cursor-pointer"
          onClick={() => setIsOverlayOpen(true)}
        >
          {/* Left Side */}
          <div className="flex flex-col items-start gap-3 w-2/3">
            {/* User Info */}
            <CardHeader className="p-0">
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
                  <p className="text-sm font-medium line-clamp-1 max-w-[100px] sm:max-w-[150px] md:max-w-[200px] lg:max-w-[250px] xl:max-w-xs">
                    {user.username}
                  </p>

                  <p className="text-xs text-white/70">
                    {format(new Date(createdAt), "dd MMM yyyy")}
                  </p>
                </div>
              </div>
            </CardHeader>

            {/* Title & Description */}
            <CardContent className="p-0">
              <p className="text-sm text-white/80 line-clamp-1">{caption}</p>
            </CardContent>

            {/* Badges (Optional for dream tags/emotions) */}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-wrap gap-1"
            >
              <Badge variant="secondary" className="bg-purple-800 text-white">
                Lucid-to change
              </Badge>
              <Badge variant="secondary" className="bg-indigo-700 text-white">
                Peaceful-to change
              </Badge>
            </motion.div>

            {/* Stats */}
            <CardFooter className="p-0" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-3 mt-2 text-white/70">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1">
                        <HeartIcon
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLike();
                          }}
                          liked={liked}
                        />
                        <span>{post.likeCount}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>Like</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="text-white h-5 w-5" />
                        <span>{commentCount}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>Comments</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1">
                        <BookmarkIcon
                          bookmarked={bookmarked}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBookmark();
                          }}
                        />
                        <span>{post.bookmarkCount}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>Bookmark</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardFooter>
          </div>

          {/* Right Side (Image) */}
          <div className="w-1/3 h-full">
            <img
              src={image || NoImage}
              alt="Dream visual"
              className="w-full h-full rounded-lg object-cover transition-all duration-500 ease-in-out hover:brightness-110"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = NoImage;
              }}
            />
          </div>
        </Card>
      </motion.div>

      {/* {isOverlayOpen && (
        <PostsOverlay
          post={post}
          onClose={onClose}
          handleLike={handleLike}
          handleBookmark={handleBookmark}
        />
      )} */}
      {isOverlayOpen && (
        <PostOverlay
          post={post}
          onClose={onClose}
          handleLike={handleLike}
          handleBookmark={handleBookmark}
          updatePost={updatePost}
        />
      )}
    </div>
  );
};

export default PostCard;

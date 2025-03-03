import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import HeartIcon from "../icons/HeartIcon";
import BookmarkIcon from "../icons/BookmarkIcon";
import PostsOverlay from "../overlays/PostsOverlay";
// import PostOverlay from "../overlays/PostOverlay";

const CommentCard = ({ post }) => {
  const { user, date, title, description, image, stats } = post;
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  useEffect(() => {
    if (isOverlayOpen) {
      document.documentElement.classList.add("overlay-open");
    } else {
      document.documentElement.classList.remove("overlay-open");
    }
  }, [isOverlayOpen]);

  return (
    <div>
      <Card
        className=" relative flex gap-2 items-center justify-between bg-[#3a1c3f] text-white p-4 rounded-2xl shadow-md w-full max-w-2xl
    "
        onClick={() => {
          setIsOverlayOpen(true);
        }}
      >
        {isOverlayOpen && (
          <PostsOverlay
            post={post}
            setIsOverlayOpen={setIsOverlayOpen}
            className="z-10"
          />
        )}

        {/* Left Side */}
        <div className="flex flex-col gap-3 w-2/3">
          {/* User Info */}
          <CardHeader className="p-0">
            <div className="flex items-center gap-2">
              <img
                src={user.profilePicture}
                alt={user.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-gray-300">{date}</p>
              </div>
            </div>
          </CardHeader>

          {/* Title & Description */}
          <CardContent className="p-0">
            <h2 className="text-xl font-bold">{title}</h2>
            <p className="text-sm text-gray-300 line-clamp-1">{description}</p>
          </CardContent>

          {/* Stats */}
          <CardFooter className="p-0" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mt-2 text-gray-300">
              <div className="flex items-center gap-1">
                <HeartIcon setLiked={setLiked} liked={liked} />
                <span>{stats.likes}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="text-white h-5 w-5" />
                <span>{stats.comments}</span>
              </div>
              <div className="flex items-center gap-1">
                <BookmarkIcon
                  setBookmarked={setBookmarked}
                  bookmarked={bookmarked}
                />
                <span>{stats.bookmarks}</span>
              </div>
            </div>
          </CardFooter>
        </div>

        {/* Right Side (Image) */}
        <div className="w-1/3 h-full">
          <img
            src={image}
            alt={title}
            className="w-full h-full rounded-lg object-cover"
          />
        </div>
      </Card>
    </div>
  );
};

export default CommentCard;

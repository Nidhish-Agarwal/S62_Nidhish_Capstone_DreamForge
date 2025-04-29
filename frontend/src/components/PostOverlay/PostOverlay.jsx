// Enhanced PostOverlay with full UX, animations, and image support

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, X } from "lucide-react";
import { useEffect, useRef } from "react";
import useAuth from "../../hooks/useAuth";
import CommentSection from "./CommentSection";
import HeartIcon from "../icons/HeartIcon";
import BookmarkIcon from "../icons/BookmarkIcon";
import { toast } from "sonner";
import NoImage from "../../assets/No-Image.png";

export default function PostOverlay({
  post,
  onClose,
  handleLike,
  handleBookmark,
  updatePost,
}) {
  const {
    user,
    caption,
    hashtags,
    likeCount,
    commentCount,
    bookmarkCount,
    createdAt,
    dream,
    image,
    isEdited,
    visibility,
    likes = [],
    bookmarks = [],
  } = post;

  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  const auth = useAuth();
  const liked = likes.includes(auth.auth.userId);
  const bookmarked = bookmarks.includes(auth.auth.userId);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent
        className="[&>[data-radix-dialog-close]]:hidden
 max-w-3xl w-full max-h-[90vh] overflow-hidden rounded-2xl border-none bg-white dark:bg-zinc-900 p-0 shadow-xl"
        onInteractOutside={onClose}
      >
        {/* <DialogHeader>
          <DialogTitle className="sr-only">
            {dream?.title || "Dream Post"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            View details and interact with a dream post.
          </DialogDescription>
        </DialogHeader> */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col h-full max-h-[90vh] overflow-auto"
        >
          <Card className="flex flex-col flex-grow">
            {/* Header */}
            <CardHeader className="flex flex-row items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={user.profileImage} />
                  <AvatarFallback>
                    {user.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-base">{user.username}</p>
                  <p className="text-sm text-muted-foreground">
                    {timeAgo}{" "}
                    {isEdited && <span className="italic">(edited)</span>}
                  </p>
                </div>
              </div>
              {/* <DialogClose asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-4 right-4 z-50"
                >
                  <X className="h-5 w-5" />
                </Button>
              </DialogClose> */}
            </CardHeader>

            {/* Image */}
            {
              <div className="w-full max-h-[400px] overflow-hidden bg-black">
                <img
                  src={image || NoImage}
                  alt="Dream Post"
                  className="w-full h-auto max-h-[400px] object-cover mx-auto"
                />
              </div>
            }

            {/* Caption + Tags */}
            <CardContent className="px-4 py-3">
              {dream?.title && (
                <motion.p
                  className="text-lg font-medium mb-1 text-primary"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                >
                  {dream.title}
                </motion.p>
              )}
              {caption && (
                <p className="mb-2 text-base leading-relaxed">{caption}</p>
              )}
              <div className="flex flex-wrap gap-2 mb-2">
                {hashtags.map((tag, i) => (
                  <Badge key={i} variant="secondary">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </CardContent>

            {/* Footer Actions */}
            <CardFooter className="flex justify-between items-center px-4 pt-0 pb-3">
              <TooltipProvider>
                <div className="flex gap-4 items-center">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          handleLike();
                          toast.success(liked ? "Unliked" : "Liked");
                        }}
                        className="flex items-center gap-1"
                      >
                        <HeartIcon liked={liked} />
                        <span>{likeCount}</span>
                      </motion.button>
                    </TooltipTrigger>
                    <TooltipContent>Like</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="text-[#FC607F] h-5 w-5" />
                        <span>{commentCount}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>Comments</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          handleBookmark();
                          toast.success(
                            bookmarked ? "Removed Bookmark" : "Bookmarked"
                          );
                        }}
                        className="flex items-center gap-1"
                      >
                        <BookmarkIcon bookmarked={bookmarked} />
                        <span>{bookmarkCount}</span>
                      </motion.button>
                    </TooltipTrigger>
                    <TooltipContent>Bookmark</TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
              <Badge variant="outline" className="text-xs">
                Visibility: {visibility}
              </Badge>
            </CardFooter>

            <Separator className="my-1" />

            {/* Comment Section */}
            <div className="overflow-y-auto px-4 pb-4 flex-grow scrollbar-thin">
              <CommentSection
                postId={post._id}
                commentCount={commentCount}
                incrementCommentCount={() => {
                  updatePost({ ...post, commentCount: post.commentCount + 1 });
                }}
              />
            </div>
          </Card>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

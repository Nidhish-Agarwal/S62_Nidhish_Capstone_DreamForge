import React, { useRef, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ChevronDown,
  ChevronUp,
  MessageSquare,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReplyList from "./ReplyList";
import ReplyInput from "./ReplyInput";
import ThumbsUpIcon from "../icons/ThumbsUpIcon";
import ThumbsDownIcon from "../icons/ThumbsDownIcon";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const CommentItem = ({
  comment,
  onAddReply,
  activeReplyId,
  setActiveReplyId,
}) => {
  const auth = useAuth();
  const isOwner = auth.auth.userId === comment.user._id;

  const [likedByUser, setLikedByUser] = useState(
    comment.likes.includes(auth.auth.userId)
  );
  const [dislikedByUser, setDislikedByUser] = useState(
    comment.dislikes.includes(auth.auth.userId)
  );
  const [likesCount, setLikesCount] = useState(comment.likes.length);
  const [dislikesCount, setDislikesCount] = useState(comment.dislikes.length);
  const [showReplies, setShowReplies] = useState(false);

  const axiosPrivate = useAxiosPrivate();
  const replyListRef = useRef();

  const handleReaction = async (reactionType) => {
    try {
      const res = await axiosPrivate.put(
        `community/comment/${comment._id}/react`,
        { reaction: reactionType }
      );
      const data = res.data;
      setLikesCount(data.likes);
      setDislikesCount(data.dislikes);
      setLikedByUser(data.likedByUser);
      setDislikedByUser(data.dislikedByUser);
    } catch (err) {
      console.error(err);
      toast.error("Failed to react.");
    }
  };

  const handleReplySubmit = async (text) => {
    try {
      const res = await axiosPrivate.post(
        `/community/comment/${comment._id}/reply`,
        { text }
      );
      toast.success("Reply added!");
      setActiveReplyId(null);
      onAddReply(comment._id, res.data.replyId);
      if (showReplies && replyListRef.current) {
        replyListRef.current.refetchReplies();
      }
      setShowReplies(true);
    } catch (error) {
      console.error(error);
      toast.error("Failed to add reply.");
    }
  };

  const toggleReplyBox = () => {
    setActiveReplyId(activeReplyId === comment._id ? null : comment._id);
  };

  const getTimeAgo = (timestamp) => {
    const currentTime = new Date();
    const previousTime = new Date(timestamp);
    const diffInSeconds = Math.floor((currentTime - previousTime) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} sec ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hrs ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays} days ago`;
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return `${diffInMonths} months ago`;
    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} years ago`;
  };

  return (
    <Card className="shadow-none border-none bg-transparent p-0">
      <CardHeader className="p-2 flex flex-row items-start gap-3">
        <HoverCard openDelay={100} closeDelay={100}>
          <HoverCardTrigger asChild>
            <div className="flex items-center gap-3 cursor-pointer">
              <Avatar className="w-8 h-8">
                <AvatarImage
                  src={comment.user.profileImage}
                  alt="Profile Picture"
                />
                <AvatarFallback className="text-gray-600 dark:text-white font-bold text-2xl">
                  {comment.user?.username
                    ? comment.user.username
                        .split(" ")
                        .map((word) => word[0])
                        .join("")
                        .toUpperCase()
                    : "?"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-sm">
                  {comment.user.username}{" "}
                  {isOwner && (
                    <span className="text-xs text-muted-foreground">(you)</span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  {getTimeAgo(comment.createdAt || comment.date)}
                </p>
              </div>
            </div>
          </HoverCardTrigger>
          <HoverCardContent
            className="w-72 p-4 z-50"
            sideOffset={10}
            align="start"
          >
            <div className="flex gap-3 items-start">
              <img
                src={comment.user.profileImage}
                alt="User"
                className="w-12 h-12 rounded-full"
              />
              <div className="flex flex-col gap-1">
                <p className="font-semibold text-base">
                  {comment.user.username}
                </p>
                <p className="text-sm text-muted-foreground break-words">
                  {comment.user.bio || "No bio available."}
                </p>
                <p className="text-xs text-muted-foreground italic">
                  Joined:{" "}
                  {new Date(comment.user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>

        {isOwner && (
          <div className="ml-auto flex gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Pencil className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Edit</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </CardHeader>

      <CardContent className="ml-9 pt-0 pb-0 px-4 text-gray-800 text-sm whitespace-pre-line">
        {comment.text}
      </CardContent>

      <CardFooter className="ml-6 px-4 pt-0 pb-2 flex flex-wrap gap-3 text-muted-foreground">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "flex items-center gap-1",
            likedByUser && "text-red-500"
          )}
          onClick={() => handleReaction("like")}
        >
          <ThumbsUpIcon liked={likedByUser} /> {likesCount}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "flex items-center gap-1",
            dislikedByUser && "text-blue-500"
          )}
          onClick={() => handleReaction("dislike")}
        >
          <ThumbsDownIcon disliked={dislikedByUser} /> {dislikesCount}
        </Button>
      </CardFooter>

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="px-4 pb-3 overflow-hidden"
        >
          <ReplyInput
            placeholder={`Reply to ${comment.user.username}`}
            onSubmit={handleReplySubmit}
            onCancel={() => setActiveReplyId(null)}
          />
        </motion.div>
      </AnimatePresence>

      {comment.replies?.length > 0 && (
        <div className="px-4 pb-3">
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="ml-9 text-sm text-blue-600 hover:underline flex items-center gap-1"
          >
            {showReplies ? (
              <>
                <ChevronUp size={16} />
                <span>Hide Replies</span>
              </>
            ) : (
              <>
                <ChevronDown size={16} />
                <span>Show Replies ({comment.replies.length})</span>
              </>
            )}
          </button>

          <AnimatePresence>
            {showReplies && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2"
              >
                <ReplyList ref={replyListRef} commentId={comment._id} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <hr className="mx-4 mt-2 border-muted" />
    </Card>
  );
};

export default CommentItem;

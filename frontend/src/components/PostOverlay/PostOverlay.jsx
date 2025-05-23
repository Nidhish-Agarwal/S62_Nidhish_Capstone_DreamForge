import { Dialog, DialogContent } from "@/components/ui/dialog";
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
import { MessageSquare, ArrowRight } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import CommentSection from "./CommentSection";
import HeartIcon from "../icons/HeartIcon";
import BookmarkIcon from "../icons/BookmarkIcon";
import { toast } from "sonner";
import NoImage from "../../assets/No-Image.png";
import DreamPersonalityTypes from "../../data/DreamPersonalityTypes.json";
import DreamDetailsOverlay from "../overlays/DreamDetailOverlay";
import { useState } from "react";

export default function PostOverlay({
  post,
  onClose,
  handleLike,
  handleBookmark,
  updatePost,
  onViewFullAnalysis,
}) {
  const auth = useAuth();
  const {
    user,
    caption,
    dream,
    image,
    hashtags,
    likeCount,
    commentCount,
    bookmarkCount,
    createdAt,
    isEdited,
    visibility,
    likes = [],
    bookmarks = [],
  } = post;

  const liked = likes.includes(auth.auth.userId);
  const bookmarked = bookmarks.includes(auth.auth.userId);
  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  const personality = DreamPersonalityTypes.find(
    (p) => p.id === dream.analysis?.dream_personality_type?.type
  );
  const [openOverlay, setOpenOverlay] = useState(false);

  return (
    <Dialog open onOpenChange={onClose}>
      {openOverlay && (
        <DreamDetailsOverlay
          dream={dream}
          setOpenOverlay={setOpenOverlay}
          handleLike={handleLike}
          liked={liked}
        />
      )}
      <DialogContent className="max-w-3xl w-full max-h-[90vh] overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 p-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
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
            </CardHeader>

            {/* Image */}
            <div className="w-full max-h-[400px] overflow-hidden bg-black">
              <img
                src={dream.analysis.image_url || NoImage}
                alt="Dream Post"
                className="w-ful h-auto max-h-[400px] object-cover mx-auto"
              />
            </div>

            {/* Content */}
            <CardContent className="px-4 py-3">
              {dream?.title && (
                <motion.p
                  className="text-lg font-bold text-primary mb-2"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                >
                  {dream.title}
                </motion.p>
              )}
              {caption && (
                <p className="mb-3 text-base leading-relaxed">{caption}</p>
              )}

              {/* Mood & Vibe */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">
                  {dream.mood === "Happy"
                    ? "😊"
                    : dream.mood === "Neutral"
                    ? "😐"
                    : dream.mood === "Sad"
                    ? "😔"
                    : dream.mood === "Terrified"
                    ? "😭"
                    : "🤩"}
                </span>
                <Badge variant="outline" className="text-sm">
                  {dream.mood} mood
                </Badge>
                {dream.analysis?.vibe?.tone && (
                  <Badge className="text-xs bg-pink-500/20 text-pink-600">
                    {dream.analysis.vibe.tone}
                  </Badge>
                )}
              </div>

              {/* Dream Personality */}
              {personality && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-3"
                >
                  <h4 className="text-sm font-medium text-gray-400">
                    Dream Personality Type:
                  </h4>
                  <Badge className="text-sm bg-pink-500/20 text-pink-600 mt-1">
                    {personality.name} — {personality.short_description}
                  </Badge>
                </motion.div>
              )}

              {/* Hashtags */}
              {/* <div className="flex flex-wrap gap-2 mt-3">
                {hashtags.map((tag, i) => (
                  <Badge key={i} variant="secondary">
                    #{tag}
                  </Badge>
                ))}
              </div> */}
            </CardContent>

            <CardFooter className="flex flex-col gap-3 px-4 py-2">
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-4">
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
                </div>
                <Badge variant="outline" className="text-xs">
                  Visibility: {visibility}
                </Badge>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="self-center gap-2 text-sm"
                onClick={() => setOpenOverlay(true)}
              >
                View Full Dream Analysis <ArrowRight className="w-4 h-4" />
              </Button>
            </CardFooter>

            <Separator />

            <div className="overflow-y-auto px-4 pb-4 flex-grow scrollbar-thin">
              <CommentSection
                postId={post._id}
                commentCount={commentCount}
                updateCommentCount={(action) => {
                  if (action === "increment") {
                    updatePost({
                      ...post,
                      commentCount: post.commentCount + 1,
                    });
                  } else {
                    updatePost({
                      ...post,
                      commentCount: post.commentCount - 1,
                    });
                  }
                }}
              />
            </div>
          </Card>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

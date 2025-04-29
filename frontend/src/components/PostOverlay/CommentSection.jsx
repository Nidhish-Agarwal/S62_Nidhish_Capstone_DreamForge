import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import CommentItem from "./CommentItem";
import CommentInput from "./CommentInput";
import { ChevronDown, Loader2 } from "lucide-react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import SortIcon from "../icons/Sort_Icon";
import Lottie from "lottie-react";
import Ghost from "../../assets/lotties/ghost.json";

const SORT_OPTIONS = ["Most Recent", "Most Liked", "Oldest"];

export default function CommentSection({
  postId,
  commentCount,
  incrementCommentCount,
}) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [currentSort, setCurrentSort] = useState("Most Recent");
  const [activeReplyId, setActiveReplyId] = useState(null);
  const axiosPrivate = useAxiosPrivate();

  const fetchComments = async ({
    reset = false,
    pageParam = 1,
    sortParam = currentSort,
  }) => {
    try {
      if (reset) {
        setLoading(true);
        setPage(1);
      } else {
        setIsLoadingMore(true);
      }

      const sortQuery =
        sortParam === "Most Liked"
          ? "mostLiked"
          : sortParam === "Oldest"
          ? "oldest"
          : "latest";

      const response = await axiosPrivate.get(
        `/community/${postId}/comments?page=${pageParam}&limit=10&sort=${sortQuery}`
      );

      const newComments = response.data.comments || [];
      const moreAvailable = pageParam < response.data.totalPages;

      setHasMore(moreAvailable);
      setComments((prev) => (reset ? newComments : [...prev, ...newComments]));
    } catch (error) {
      toast.error("Failed to load comments. Please try again later.");
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchComments({ reset: true, pageParam: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId, currentSort]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchComments({ pageParam: nextPage });
  };

  return (
    <div className="space-y-6">
      <CommentInput
        postId={postId}
        onCommentAdded={(newComment) => {
          setComments((prev) => [newComment, ...prev]);
          incrementCommentCount();
        }}
      />

      <div className="flex justify-between items-center mb-3 relative">
        <div className="flex gap-2 items-center">
          <h3 className="font-bold text-xl">Comments</h3>
          <div className="px-3 py-[2px] text-white font-bold bg-pink-500 rounded-full text-xs">
            {commentCount || comments.length}
          </div>
        </div>

        <button
          className="text-sm flex gap-1 items-center text-muted-foreground hover:text-foreground"
          onClick={() => setSortOpen((prev) => !prev)}
        >
          <SortIcon size={18} />
          <span>{currentSort}</span>
          <ChevronDown size={18} />
        </button>

        <AnimatePresence>
          {sortOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="absolute top-12 right-0 bg-white shadow-md rounded-lg p-2 w-40 z-20"
            >
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setSortOpen(false);
                    setCurrentSort(option);
                    toast.success(`Sorted by ${option}`);
                  }}
                  className="block w-full text-left px-3 py-2 hover:bg-gray-100"
                >
                  {option}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse space-y-2 bg-muted p-4 rounded-2xl shadow-sm"
            >
              <div className="h-4 w-1/2 bg-gray-300 rounded" />
              <div className="h-3 w-full bg-gray-300 rounded" />
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-muted-foreground text-sm text-center py-8 flex flex-col items-center"
        >
          <Lottie
            animationData={Ghost}
            loop
            autoplay
            style={{ height: "150px", width: "150px" }}
          />
          <p>💭 No comments yet. Be the first to comment!</p>
        </motion.div>
      ) : (
        <motion.div layout className="space-y-4">
          <AnimatePresence>
            {comments.map((comment) => (
              <motion.div
                key={comment._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <CommentItem
                  comment={comment}
                  activeReplyId={activeReplyId}
                  setActiveReplyId={setActiveReplyId}
                  onAddReply={(commentId, replyId) =>
                    setComments((prev) =>
                      prev.map((c) =>
                        c._id === commentId
                          ? { ...c, replies: [...c.replies, replyId] }
                          : c
                      )
                    )
                  }
                />
              </motion.div>
            ))}
          </AnimatePresence>

          {hasMore && (
            <div className="flex justify-center pt-4">
              <button
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="text-sm flex gap-2 items-center px-4 py-2 rounded-xl border hover:bg-muted transition"
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4" /> Loading...
                  </>
                ) : (
                  "Load More Comments"
                )}
              </button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

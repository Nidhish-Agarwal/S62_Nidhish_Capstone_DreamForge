import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Loader, Star, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button"; // Assuming ShadCN components
import ReplyItem from "./ReplyItem";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Skeleton } from "@/components/ui/skeleton"; // ShadCN Skeleton for smoother loading

const ReplyList = forwardRef(({ commentId, updateCommentCount }, ref) => {
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null); // Track errors
  const axiosPrivate = useAxiosPrivate();

  // Fetch replies based on the current page
  const fetchReplies = async (reset = false, pageParam = 1) => {
    try {
      if (reset) {
        setLoading(true);
        setPage(1);
        setReplies([]);
      } else {
        setIsLoadingMore(true);
      }

      const response = await axiosPrivate.get(
        `/community/comment/${commentId}/replies?page=${pageParam}&limit=5`
      );
      const data = response.data;
      const newReplies = data.replies || [];
      const moreAvailable = pageParam < data.totalPages;

      setHasMore(moreAvailable);
      setReplies((prev) => (reset ? newReplies : [...prev, ...newReplies]));
    } catch (error) {
      console.error(error);
      setError("Failed to load replies. Please try again later.");
      toast.error("Failed to load replies. Please try again later.");
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchReplies(true, 1);
  }, [commentId]);

  useImperativeHandle(ref, () => ({
    refetchReplies: () => fetchReplies(true, 1),
  }));

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchReplies(false, nextPage);
  };

  const updateReply = (updatedReply) => {
    setReplies((prev) =>
      prev.map((r) => (r._id === updatedReply._id ? updatedReply : r))
    );
  };

  return (
    <div className="pl-6 mt-2 space-y-4 border-l-2 border-muted/30">
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="p-4 rounded-2xl shadow-sm" />
          ))}
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : replies.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          No replies yet. Be the first!
        </p>
      ) : (
        <div className="space-y-3">
          {replies.map((reply) => (
            <ReplyItem
              key={reply._id}
              reply={reply}
              updateReply={updateReply}
              updateCommentCount={updateCommentCount}
              commentId={commentId}
              onDelete={(replyId) =>
                setReplies((prev) => prev.filter((r) => r._id !== replyId))
              }
            />
          ))}

          {hasMore && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Button
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="text-sm px-4 py-2 rounded-xl border hover:bg-muted transition"
              >
                {isLoadingMore ? (
                  <Loader className="animate-spin w-4 h-4 mr-2 text-muted" />
                ) : (
                  "Load More Replies"
                )}
              </Button>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
});

export default ReplyList;

import React, { useState, useEffect, useCallback } from "react";
import PostCard from "../components/Cards/PostCard";
import { useInView } from "react-intersection-observer";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/components/ui/command";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ArrowUpIcon } from "lucide-react";

export default function AllPostsPage() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { ref, inView } = useInView();
  const axiosPrivate = useAxiosPrivate();

  const fetchPosts = useCallback(
    async (pageToFetch = page) => {
      if (!hasMore) return;
      setLoading(true);
      setError(null);
      try {
        const params = { page: pageToFetch, limit: 10 };
        const response = await axiosPrivate.get("community/post", { params });
        const { posts: newPosts, currentPage, totalPages } = response.data;

        setPosts((prev) =>
          pageToFetch === 1 ? newPosts : [...prev, ...newPosts]
        );
        setHasMore(currentPage < totalPages);
      } catch (err) {
        setError("Unable to load posts.");
        toast.error("Failed to fetch posts. Please try again.", {
          description: "Please check your connection and try again later.",
        });
      } finally {
        setLoading(false);
      }
    },
    [hasMore, axiosPrivate]
  );

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  // infinite scroll trigger
  useEffect(() => {
    if (inView && hasMore && !loading && !error) {
      setPage((p) => p + 1);
    }
  }, [inView, hasMore, loading, error]);

  const retryFetch = () => {
    setError(null);
    fetchPosts();
  };

  const updatePost = (updatedPost) => {
    setPosts((prev) =>
      prev.map((p) => (p._id === updatedPost._id ? updatedPost : p))
    );
  };

  console.log(posts);

  // Post skeleton loading component
  const PostSkeleton = () => (
    <div className="w-full bg-white rounded-xl shadow-sm p-4 animate-pulse">
      <div className="flex items-start gap-3 mb-4">
        <Skeleton className="w-10 h-10 rounded-full bg-gray-300" />
        <div className="flex-1">
          <Skeleton className="h-4 w-32 bg-gray-300 mb-2" />
          <Skeleton className="h-3 w-24 bg-gray-200" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4 bg-gray-300" />
        <Skeleton className="h-4 w-full bg-gray-200" />
        <Skeleton className="h-4 w-5/6 bg-gray-300" />
      </div>
      <div className="mt-4 pt-3 border-t">
        <div className="flex justify-between">
          <Skeleton className="h-8 w-20 bg-gray-300 rounded-md" />
          <Skeleton className="h-8 w-20 bg-gray-300 rounded-md" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full flex flex-col items-center relative p-4">
      {/* Error Alert */}
      {error && (
        <Alert className="w-full max-w-xl mb-4 bg-red-50 border border-red-200 text-red-800 rounded-xl shadow-sm p-4 flex items-start gap-3">
          ❌
          <div className="flex-1">
            <AlertTitle className="font-semibold">
              Something went wrong
            </AlertTitle>
            <AlertDescription className="text-sm">
              {error}
              <Button
                variant="link"
                size="sm"
                onClick={retryFetch}
                className="ml-1 text-sm text-red-700"
              >
                Retry
              </Button>
            </AlertDescription>
          </div>
        </Alert>
      )}

      {/* Posts Grid or States */}
      {loading && posts.length === 0 ? (
        <div className="grid grid-cols-1 gap-4 w-full max-w-xl">
          {[1, 2, 3].map((i) => (
            <PostSkeleton key={i} />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center text-gray-600 py-20">
          <p>No posts found.</p>
          <Button
            onClick={() => setError(null) || setPage(1)}
            variant="secondary"
            className="mt-2"
          >
            Refresh
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 w-full max-w-xl">
          {posts.map((post) => (
            <div
              key={post._id}
              className="animate-fade-in-up transition-all duration-500"
            >
              <PostCard post={post} updatePost={updatePost} />
            </div>
          ))}
        </div>
      )}

      {/* Loading Skeleton for more pages */}
      {loading && posts.length > 0 && (
        <div className="w-full max-w-xl mt-6">
          <PostSkeleton />
        </div>
      )}

      {/* Load More / Infinite Trigger */}
      {!loading && hasMore && <div ref={ref} className="h-4 w-full" />}

      {!hasMore && posts.length > 0 && (
        <p className="mt-6 text-gray-500">— You've reached the end —</p>
      )}

      {/* Back to Top */}
      <Button
        className="fixed bottom-20 right-7 rounded-full p-2 shadow-md backdrop-blur-lg bg-white/70 border border-gray-300 hover:bg-white transition"
        variant="ghost"
        onClick={() => {
          console.log("scrolling to the top");
          document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        <ArrowUpIcon className="text-gray-700" />
      </Button>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import DreamCard from "../components/Cards/DreamCard";
import { useInView } from "react-intersection-observer";
import { Skeleton } from "@/components/ui/skeleton";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { io } from "socket.io-client";

const MyDreamsPage = () => {
  const [dreams, setDreams] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView();
  const axiosPrivate = useAxiosPrivate();

  // Socket.IO setup
  useEffect(() => {
    const socket = io("http://localhost:8080", {
      withCredentials: true,
    });

    socket.on("dream-updated", (updatedDream) => {
      console.log("received update");
      setDreams((prev) =>
        prev.map((d) =>
          d._id === updatedDream._id ? { ...d, ...updatedDream } : d
        )
      );
    });

    return () => socket.disconnect();
  }, []);

  // Fetch dreams with infinite scroll
  useEffect(() => {
    const fetchDreams = async () => {
      try {
        const response = await axiosPrivate.get(
          `/dream/getdreams?page=${page}`
        );
        setDreams((prev) => [...prev, ...response.data.dreams]);
        setHasMore(response.data.currentPage < response.data.totalPages);
      } catch (error) {
        console.error("Error fetching dreams:", error);
      }
    };

    if (inView && hasMore) {
      fetchDreams();
      setPage((p) => p + 1);
    }
  }, [inView]);

  // Retry handler
  const handleRetry = async (dreamId) => {
    try {
      await axiosPrivate.post(`/dream/${dreamId}/retry`);
    } catch (error) {
      console.error("Retry failed:", error);
    }
  };

  return (
    <div className="w-full flex-row flex justify-center">
      <div className="grid grid-cols-1  sm:grid-cols-2 gap-4 z-0">
        {dreams.map((dream) => (
          <DreamCard key={dream._id} dream={dream} onRetry={handleRetry} />
        ))}

        {hasMore && (
          <div ref={ref} className="col-span-full">
            <Skeleton className="h-96 w-72 bg-gray-800 rounded-xl" />
          </div>
        )}
      </div>
    </div>
  );
};

export default MyDreamsPage;

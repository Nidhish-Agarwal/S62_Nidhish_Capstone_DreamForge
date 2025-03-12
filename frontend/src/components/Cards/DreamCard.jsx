import React, { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import DreamDetailsOverlay from "../overlays/DreamDetailOverlay";
import { motion } from "framer-motion";
import HeartIcon from "../icons/HeartIcon";
import { RotateCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const DreamCard = ({ dream, onRetry }) => {
  const [isRetrying, setIsRetrying] = useState(false);
  const [liked, setLiked] = useState(dream.isLiked);
  const [openOverlay, setOpenOverlay] = useState(false);
  const axiosPrivate = useAxiosPrivate();

  // Handle retry functionality
  const handleRetry = async (e) => {
    e.stopPropagation();
    setIsRetrying(true);
    try {
      await onRetry(dream._id);
    } finally {
      setIsRetrying(false);
    }
  };

  const {
    title,
    description,
    date,
    image = "/fallback.jpg", // Fallback image to prevent crashes
    sentiment = {},
    analysis_status,
    retry_count = 0,
  } = dream;

  // For the progress bar, we use the maximum of the sentiment values as a placeholder.
  // You might replace this with a real progress value if available.
  const positivePercentage = sentiment.positive || 0;
  const negativePercentage = sentiment.negative || 0;
  const progressWidth = Math.max(positivePercentage, negativePercentage, 5);

  // Define progress color based on sentiment comparison when completed
  const progressColor =
    analysis_status === "completed"
      ? positivePercentage > negativePercentage
        ? "bg-green-500"
        : "bg-red-500"
      : "bg-blue-500";

  useEffect(() => {
    if (openOverlay) {
      document.documentElement.classList.add("overlay-open");
    } else {
      document.documentElement.classList.remove("overlay-open");
    }
  }, [openOverlay]);

  return (
    <Card className="relative w-72 h-96 overflow-hidden border-0 group shadow-lg">
      {/* Status Overlay */}
      {analysis_status !== "completed" && (
        <div className="absolute inset-0 z-10 flex items-center justify-center p-6 bg-gradient-to-br from-black/80 to-gray-900 rounded-lg">
          {analysis_status === "processing" ? (
            <div className="flex flex-col items-center space-y-4">
              <RotateCw className="h-10 w-10 animate-spin text-white" />
              <p className="text-lg font-semibold text-white">
                Analyzing your dream...
              </p>
              {/* Progress Bar */}
              <div className="w-48 h-2 bg-gray-600 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${progressColor}`}
                  initial={{ width: "0%" }}
                  animate={{ width: `${progressWidth}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <AlertCircle className="h-10 w-10 text-red-400" />
              <p className="text-lg font-semibold text-white">
                Analysis failed
              </p>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleRetry}
                disabled={isRetrying || retry_count >= 3}
                className="px-4 py-2"
              >
                {isRetrying ? (
                  <RotateCw className="h-5 w-5 animate-spin mr-2" />
                ) : (
                  <RotateCw className="h-5 w-5 mr-2" />
                )}
                {retry_count >= 3 ? "Max Retries" : "Try Again"}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
        style={{ backgroundImage: `url(${image})` }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {openOverlay && (
        <DreamDetailsOverlay dream={dream} setOpenOverlay={setOpenOverlay} />
      )}

      {/* Content */}
      <div
        className="relative h-full flex flex-col p-4 space-y-4 cursor-pointer"
        onClick={() => setOpenOverlay(true)}
      >
        <div className="text-xs text-white/90">
          {format(new Date(date), "dd MMM yyyy")}
        </div>

        <CardContent className="flex-1 flex items-center p-0">
          <div className="text-center w-full">
            <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
            <p className="text-sm text-white/90 line-clamp-3">{description}</p>
          </div>
        </CardContent>

        <CardFooter className="p-0 flex items-center justify-between">
          <div className="flex-1">
            {/* Optional small progress indicator in footer */}
            <div className="w-24 h-1 bg-gray-400 rounded-full overflow-hidden">
              <motion.div
                className={`h-full ${progressColor}`}
                initial={{ width: "0%" }}
                animate={{ width: `${progressWidth}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          </div>

          <div
            className="h-8 w-8 flex justify-center items-center rounded-full bg-white/50 hover:bg-white/60"
            onClick={async (e) => {
              e.stopPropagation();
              setLiked(!liked);
              try {
                // Call your API endpoint to toggle like.
                const response = await axiosPrivate.put(
                  `/dream/${dream._id}/like`
                );
                // Update state with response if needed:
                setLiked(response.data.isLiked);
              } catch (error) {
                console.error("Error updating like:", error);
                // Optionally, revert UI if error occurs
                setLiked(liked);
              }
            }}
          >
            <HeartIcon liked={liked} setLiked={setLiked} />
          </div>
        </CardFooter>
      </div>
    </Card>
  );
};

export default DreamCard;

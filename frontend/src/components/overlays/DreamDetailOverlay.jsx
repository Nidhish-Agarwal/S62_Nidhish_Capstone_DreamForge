import { useState } from "react";
import { motion } from "framer-motion";
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import { FaEdit, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { format } from "date-fns";
import HeartIcon from "../icons/HeartIcon";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import NoImage from "../../assets/No-Image.png";

export default function DreamDetailsOverlay({
  dream,
  setOpenOverlay,
  updateDream,
}) {
  const axiosPrivate = useAxiosPrivate();
  const liked = dream.isLiked;
  const positivePercentage = dream.analysis.sentiment.positive;
  const negativePercentage = dream.analysis.sentiment.negative;

  const handleLike = async (e) => {
    e.stopPropagation();
    try {
      const response = await axiosPrivate.put(`/dream/${dream._id}/like`);
      const updated = {
        ...dream,
        isLiked: response.data.isLiked,
      };
      updateDream(updated);
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  const progressWidth = Math.max(positivePercentage, negativePercentage);
  const emotion =
    positivePercentage > negativePercentage ? "Positive" : "Negative";
  const progressColor =
    positivePercentage > negativePercentage ? "bg-green-400" : "bg-red-400";

  const sentimentData = {
    labels: ["Positive", "Negative", "Neutral"],
    datasets: [
      {
        data: [
          dream.analysis.sentiment.positive,
          dream.analysis.sentiment.negative,
          dream.analysis.sentiment.neutral,
        ],
        backgroundColor: ["#4CAF50", "#E63946", "#CCCCCC"],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <Dialog open={true} onOpenChange={() => setOpenOverlay(false)}>
      <DialogContent className="max-w-4xl w-full bg-gradient-to-br from-[#752345] to-[#352736] text-white p-0 overflow-hidden">
        <ScrollArea className="max-h-[90vh] p-6">
          <DialogHeader className="flex items-center justify-between">
            <FaArrowLeft
              className="cursor-pointer"
              onClick={() => setOpenOverlay(false)}
            />
            <div className="text-center">
              <DialogTitle className="text-3xl font-bold">
                {dream.title}
              </DialogTitle>
              <p className="text-xs mt-1 text-gray-300">
                {format(new Date(dream.date), "dd MMM yyyy")}
              </p>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="h-8 w-8 flex justify-center items-center rounded-full bg-white/50 hover:bg-white/60">
                    <HeartIcon liked={liked} onClick={handleLike} />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{liked ? "Unlike Dream" : "Like Dream"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </DialogHeader>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <motion.div
              className="rounded-lg shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src={dream.image || NoImage}
                alt="Dream visualization"
                className="w-full object-cover rounded-lg"
              />
              <div className="bg-white/10 p-4 rounded-lg mt-4">
                <h2 className="text-lg font-semibold">Sentiment Analysis:</h2>
                <Doughnut data={sentimentData} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl font-semibold">Description:</h2>
              <div className="bg-white/25 rounded-2xl px-5 py-6 mt-2">
                <p className="text-gray-300">{dream.description}</p>
              </div>
              <h2 className="text-xl font-semibold mt-4">Meaning:</h2>
              <div className="bg-white/25 rounded-2xl px-5 py-6 mt-2">
                <p className="text-gray-300">{dream.analysis.interpretation}</p>
              </div>
              <h2 className="text-xl font-semibold mt-4">Keywords:</h2>
              <div className="flex gap-2 mt-2 overflow-x-auto whitespace-nowrap pb-2">
                {dream.analysis.keywords.map((tag) => (
                  <Badge
                    key={tag}
                    className="bg-white/40 text-white rounded-full"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              <h2 className="text-xl font-semibold mt-4">
                {emotion === "Positive" ? "Positivity" : "Negativity"}
              </h2>
              <div className="w-full h-2 bg-black rounded overflow-hidden mt-2">
                <motion.div
                  className={`h-full ${progressColor}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progressWidth}%` }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                />
              </div>

              <p className="text-sm text-gray-300 mt-1">
                {progressWidth}% {emotion}
              </p>
            </motion.div>
          </div>

          <DialogFooter className="mt-6 flex justify-between">
            <Button variant="ghost" className="text-gray-300 gap-2">
              <FaArrowLeft /> Prev
            </Button>
            <Button className="bg-red-500 text-white gap-2">
              <FaEdit /> Edit
            </Button>
            <Button variant="ghost" className="text-gray-300 gap-2">
              Next <FaArrowRight />
            </Button>
          </DialogFooter>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

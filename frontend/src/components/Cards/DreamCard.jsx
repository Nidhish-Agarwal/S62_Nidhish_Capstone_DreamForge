import React, { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import DreamDetailsOverlay from "../overlays/DreamDetailOverlay";
import { motion } from "framer-motion";
import HeartIcon from "../icons/HeartIcon";

const DreamCard = ({ dream }) => {
  const { title, description, date, image, sentiment, isLiked } = dream;
  const [liked, setLiked] = useState(isLiked);
  const [openOverlay, setOpenOverlay] = useState(false);

  const positivePercentage = sentiment.positive;
  const negativePercentage = sentiment.negative;
  const progressWidth = Math.max(positivePercentage, negativePercentage);
  const progressColor =
    positivePercentage > negativePercentage ? "bg-green-400" : "bg-red-400";

  useEffect(() => {
    if (openOverlay) {
      document.documentElement.classList.add("overlay-open");
    } else {
      document.documentElement.classList.remove("overlay-open");
    }
  }, [openOverlay]);

  return (
    <Card className="relative w-72 h-96 overflow-hidden border-0 group overlay-open:text-black">
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
        className="relative h-full flex flex-col p-4 space-y-4"
        onClick={() => setOpenOverlay(true)}
      >
        <div className="text-xs text-white/90">{date}</div>

        <CardContent className="flex-1 flex items-center p-0">
          <div className="text-center w-full">
            <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
            <p className="text-sm text-white/90 line-clamp-3">{description}</p>
          </div>
        </CardContent>

        <CardFooter className="p-0 space-x-4">
          <div className="flex-1">
            <div className="w-32 h-2 bg-gray-300 rounded-full overflow-hidden">
              <motion.div
                className={`h-full ${progressColor}`}
                initial={{ width: "0%" }}
                animate={{ width: `${progressWidth}%` }} // Adjust for progress
                transition={{ duration: 1 }}
              />
            </div>
          </div>

          <div
            className="h-8 w-8 flex justify-center items-center rounded-full bg-white/50 hover:bg-white/60"
            onClick={(e) => {
              e.stopPropagation();
              setLiked(!liked);
            }}
          >
            <HeartIcon setLiked={setLiked} liked={liked} />
          </div>
        </CardFooter>
      </div>
    </Card>
  );
};

export default DreamCard;

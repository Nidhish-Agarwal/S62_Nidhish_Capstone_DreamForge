import { Gauge, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  motion,
  animate,
  useMotionValue,
  useMotionValueEvent,
} from "framer-motion";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect } from "react";

const getBackgroundColor = (score) => {
  return score >= 80
    ? "bg-green-500"
    : score >= 60
    ? "bg-yellow-400"
    : "bg-red-500";
};

export default function DreamscapeMeter({ score, loading, hasError }) {
  const animatedScore = useMotionValue(0);
  const [displayedScore, setDisplayedScore] = useState(0);
  // Animate score
  useEffect(() => {
    if (score !== null && !loading && !hasError) {
      animate(animatedScore, score, {
        duration: 1,
        ease: "easeOut",
      });
    }
  }, [score, loading, hasError]);

  // Listen to animatedScore changes
  useMotionValueEvent(animatedScore, "change", (latest) => {
    setDisplayedScore(Math.round(latest));
  });

  const color = getBackgroundColor(score);
  return (
    <Card
      className={cn(
        "flex items-center justify-between px-5 py-4 text-white shadow-md ",
        color
      )}
    >
      <div>
        <div className="flex flex-row gap-2">
          <p className="text-xs">Dreamscape Score</p>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-white cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs text-sm leading-snug">
                This score reflects your dream mood and positivity. A higher
                score means your dreams feel more uplifting and stable.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <h2 className="text-2xl font-bold">
          {loading ? (
            <div className=" h-full">
              <LoaderCircle className="animate-spin w-6 h-6  text-white" />
            </div>
          ) : hasError || score === null ? (
            <p className="text-sm text-black dark:text-white/80 mt-3">
              Not enough data to calculate Dreamscape.
            </p>
          ) : (
            <motion.span>{displayedScore}%</motion.span>
          )}
        </h2>
      </div>
      <Gauge className="w-8 h-8" />
    </Card>
  );
}

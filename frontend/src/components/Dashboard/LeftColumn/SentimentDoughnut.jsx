import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Info, Heart, Meh, Frown, Sparkles, Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import EmptyStateUI from "./EmptyDoughnut";

const sentimentData = {
  positive: {
    color: "#00FFB7",
    glowColor: "rgba(0, 255, 183, 0.4)",
    icon: Heart,
    emoji: "😊",
    label: "Blissful",
    gradient: "from-emerald-400 to-teal-400",
    description: "Dreams filled with joy and wonder",
  },
  neutral: {
    color: "#8B5CF6",
    glowColor: "rgba(139, 92, 246, 0.4)",
    icon: Meh,
    emoji: "😐",
    label: "Serene",
    gradient: "from-purple-400 to-indigo-400",
    description: "Balanced and peaceful dreams",
  },
  negative: {
    color: "#F97316",
    glowColor: "rgba(249, 115, 22, 0.4)",
    icon: Frown,
    emoji: "😔",
    label: "Shadowed",
    gradient: "from-orange-400 to-red-400",
    description: "Dreams with challenging emotions",
  },
};

export default function SentimentBreakdownCard({ loading, summary, hasError }) {
  const [hoveredSegment, setHoveredSegment] = useState(null);
  const [animationComplete, setAnimationComplete] = useState(false);

  // Mock data for demonstration
  const mockSummary = summary;

  useEffect(() => {
    const timer = setTimeout(() => setAnimationComplete(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (hasError) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-red-900/30 to-pink-900/30 backdrop-blur-xl border border-red-300/20 rounded-3xl p-8 text-center"
      >
        <Frown className="h-16 w-16 text-red-400 mx-auto mb-4 animate-bounce" />
        <h1 className="text-red-300 text-xl font-bold">
          Emotions are clouded...
        </h1>
        <p className="text-red-200/70 mt-2">
          Something went wrong reading your aura
        </p>
      </motion.div>
    );
  }

  if (loading || !summary) {
    return (
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-indigo-900/30 to-pink-900/20 animate-pulse rounded-3xl" />

        <Card className="relative bg-black/40 backdrop-blur-xl border border-white/10 text-white shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="text-xl font-bold tracking-wide text-purple-100 text-center py-6">
            <div className="flex items-center justify-center gap-3">
              <Heart className="h-6 w-6 animate-pulse text-pink-300" />
              Emotional Aura
              <Sparkles className="h-6 w-6 animate-pulse text-yellow-300" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6 p-8">
            <div className="flex justify-center">
              <Skeleton className="h-48 w-48 rounded-full bg-white/10" />
            </div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-8 w-8 rounded-full bg-white/10" />
                  <Skeleton className="h-4 flex-1 bg-white/10 rounded-full" />
                  <Skeleton className="h-4 w-12 bg-white/10 rounded-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (
    !summary?.sentimentBreakdown ||
    (summary.sentimentBreakdown.positive === 0 &&
      summary.sentimentBreakdown.neutral === 0 &&
      summary.sentimentBreakdown.negative === 0)
  ) {
    return <EmptyStateUI />; // Use the empty state UI component if no data is available
  }

  const { positive, neutral, negative } = mockSummary.sentimentBreakdown;
  const chartData = [
    { name: "positive", value: positive, ...sentimentData.positive },
    { name: "neutral", value: neutral, ...sentimentData.neutral },
    { name: "negative", value: negative, ...sentimentData.negative },
  ].filter((item) => item.value > 0);

  const dominantEmotion = chartData.reduce((max, current) =>
    current.value > max.value ? current : max
  );

  const CustomPieChart = () => (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          outerRadius={100}
          innerRadius={60}
          paddingAngle={2}
          dataKey="value"
          onMouseEnter={(_, index) => setHoveredSegment(chartData[index])}
          onMouseLeave={() => setHoveredSegment(null)}
        >
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.color}
              stroke={
                hoveredSegment?.name === entry.name
                  ? entry.color
                  : "transparent"
              }
              strokeWidth={hoveredSegment?.name === entry.name ? 3 : 0}
              style={{
                filter:
                  hoveredSegment?.name === entry.name
                    ? `drop-shadow(0 0 20px ${entry.glowColor})`
                    : "none",
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );

  return (
    <div className="relative min-h-[500px]">
      {/* Animated cosmic background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 rounded-3xl" />

      {/* Floating emotion particles */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl">
        {chartData.map((emotion, i) => (
          <motion.div
            key={emotion.name}
            className="absolute w-2 h-2 rounded-full"
            style={{ backgroundColor: emotion.color }}
            initial={{
              left: `${20 + i * 30}%`,
              top: `${20 + i * 20}%`,
              opacity: 0,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 1, 0.3],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      <Card className="relative bg-black/20 backdrop-blur-xl border-0 text-white shadow-2xl rounded-3xl overflow-hidden">
        <CardHeader className="text-center py-6 relative">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center gap-3 mb-2"
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Heart className="h-8 w-8 text-pink-300 drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]" />
            </motion.div>
            <CardTitle className="text-2xl font-extrabold bg-gradient-to-r from-pink-200 via-purple-200 to-indigo-200 bg-clip-text text-transparent tracking-wider">
              Emotional Aura
            </CardTitle>
            <motion.div
              animate={{
                rotate: [0, -10, 10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
            >
              <Sparkles className="h-8 w-8 text-yellow-300 drop-shadow-[0_0_10px_rgba(253,224,71,0.8)]" />
            </motion.div>
          </motion.div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="flex items-center justify-center gap-2 text-purple-200/80 cursor-help"
                >
                  <span className="text-sm font-medium">
                    The essence of your dream realm
                  </span>
                  <Info className="w-4 h-4" />
                </motion.div>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                className="max-w-xs text-center bg-black/80 border-white/20"
              >
                <p className="text-sm">
                  Discover the emotional patterns woven through your dreams
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardHeader>

        <CardContent className="p-8 space-y-6">
          {/* Mystical Chart Container */}
          <div className="relative">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative"
            >
              <CustomPieChart />

              {/* Center Content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="text-center bg-black/40 backdrop-blur-md rounded-full p-6 border border-white/10"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="text-3xl mb-2"
                  >
                    {dominantEmotion.emoji}
                  </motion.div>
                  <p className="text-sm font-bold text-white">
                    {dominantEmotion.label}
                  </p>
                  <p className="text-xs text-white/70">
                    {dominantEmotion.value}% dominant
                  </p>
                </motion.div>
              </div>
            </motion.div>

            {/* Hover Display */}
            <AnimatePresence>
              {hoveredSegment && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-md rounded-xl p-3 border border-white/20 text-center min-w-[200px]"
                >
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <hoveredSegment.icon
                      className="h-5 w-5"
                      style={{ color: hoveredSegment.color }}
                    />
                    <span className="font-bold text-white">
                      {hoveredSegment.label}
                    </span>
                  </div>
                  <p className="text-sm text-white/80">
                    {hoveredSegment.description}
                  </p>
                  <p
                    className="text-lg font-bold mt-1"
                    style={{ color: hoveredSegment.color }}
                  >
                    {hoveredSegment.value}%
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Elegant Progress Bars */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="space-y-4"
          >
            {chartData.map((emotion, index) => (
              <motion.div
                key={emotion.name}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 + index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.02, x: 5 }}
                className="group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
                      style={{
                        backgroundColor: emotion.color,
                        boxShadow: `0 0 20px ${emotion.glowColor}`,
                      }}
                    >
                      <emotion.icon className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">
                        {emotion.label}
                      </p>
                      <p className="text-white/60 text-xs">
                        {emotion.description}
                      </p>
                    </div>
                  </div>
                  <span className="text-white font-bold text-lg">
                    {emotion.value}%
                  </span>
                </div>

                <div className="h-3 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${emotion.value}%` }}
                    transition={{
                      delay: 1.5 + index * 0.2,
                      duration: 1,
                      ease: "easeOut",
                    }}
                    className="h-full rounded-full relative"
                    style={{
                      background: `linear-gradient(90deg, ${emotion.color}, ${emotion.color}dd)`,
                      boxShadow: `inset 0 0 10px ${emotion.glowColor}`,
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Mystical Insights Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.8 }}
            className="text-center pt-6 border-t border-white/10"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Moon className="h-4 w-4 text-purple-300" />
              <p className="text-purple-200/80 text-sm font-medium">
                Your dreams reflect a {dominantEmotion.label.toLowerCase()}{" "}
                inner landscape
              </p>
              <Sun className="h-4 w-4 text-yellow-300" />
            </div>
            <p className="text-purple-200/60 text-xs italic">
              "Every emotion in dreams is a message from your soul"
            </p>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
  ReferenceLine,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Info, TrendingUp, TrendingDown, Minus, Sparkles } from "lucide-react";

// Enhanced mood system with numerical values for trend analysis
const moodScale = {
  Terrified: {
    value: 1,
    color: "#DC2626",
    bgColor: "#FEF2F2",
    emoji: "😭",
    label: "Terrified",
  },
  Sad: {
    value: 2,
    color: "#2563EB",
    bgColor: "#EFF6FF",
    emoji: "😔",
    label: "Sad",
  },
  Neutral: {
    value: 3,
    color: "#6B7280",
    bgColor: "#F9FAFB",
    emoji: "😐",
    label: "Neutral",
  },
  Happy: {
    value: 4,
    color: "#059669",
    bgColor: "#ECFDF5",
    emoji: "😊",
    label: "Happy",
  },
  Euphoric: {
    value: 5,
    color: "#7C3AED",
    bgColor: "#F5F3FF",
    emoji: "🤩",
    label: "Euphoric",
  },
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length > 0) {
    const data = payload[0].payload;
    const mood = moodScale[data.mood || "Neutral"];

    return (
      <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl p-4 shadow-xl">
        <div className="text-sm font-medium text-gray-600 mb-2">{label}</div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{mood.emoji}</span>
          <div>
            <div className="font-semibold text-gray-900">{mood.label}</div>
            <div className="text-xs text-gray-500">
              Mood Level: {mood.value}/5
            </div>
          </div>
        </div>
        {data.intensity && (
          <div className="text-xs text-gray-500">
            Intensity: {data.intensity}
          </div>
        )}
      </div>
    );
  }
  return null;
};

const MoodIndicator = ({ mood, isActive }) => {
  const moodData = moodScale[mood];
  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
        isActive ? "bg-white shadow-md scale-105" : "hover:bg-white/50"
      }`}
      style={{ backgroundColor: isActive ? moodData.bgColor : "transparent" }}
    >
      <span className="text-lg">{moodData.emoji}</span>
      <span
        className={`text-sm font-medium ${
          isActive ? "text-gray-900" : "text-gray-600"
        }`}
      >
        {moodData.label}
      </span>
    </div>
  );
};

const TrendIndicator = ({ data }) => {
  if (!data || data.length < 2) return null;

  const recent = data.slice(-3);
  const trend = recent[recent.length - 1].moodValue - recent[0].moodValue;

  if (trend > 0) {
    return (
      <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-medium">
        <TrendingUp size={12} />
        Improving
      </div>
    );
  } else if (trend < 0) {
    return (
      <div className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-full text-xs font-medium">
        <TrendingDown size={12} />
        Declining
      </div>
    );
  } else {
    return (
      <div className="flex items-center gap-1 text-gray-600 bg-gray-50 px-2 py-1 rounded-full text-xs font-medium">
        <Minus size={12} />
        Stable
      </div>
    );
  }
};

const MoodLineChart = ({ summary, loading, hasError }) => {
  const [hoveredMood, setHoveredMood] = useState(null);
  const [animationComplete, setAnimationComplete] = useState(false);

  // Sample data for demonstration
  const sampleData = [
    { date: "Day 1", mood: "Neutral", intensity: 50 },
    { date: "Day 2", mood: "Happy", intensity: 65 },
    { date: "Day 3", mood: "Euphoric", intensity: 80 },
    { date: "Day 4", mood: "Happy", intensity: 70 },
    { date: "Day 5", mood: "Sad", intensity: 30 },
    { date: "Day 6", mood: "Neutral", intensity: 50 },
    { date: "Day 7", mood: "Happy", intensity: 75 },
    { date: "Day 8", mood: "Euphoric", intensity: 85 },
  ];

  const moodHistory = summary?.moodHistory || sampleData;

  // Transform data to include mood values for proper trending
  const chartData = moodHistory.map((item) => ({
    ...item,
    moodValue: moodScale[item.mood]?.value || 3,
    color: moodScale[item.mood]?.color || "#6B7280",
  }));

  useEffect(() => {
    const timer = setTimeout(() => setAnimationComplete(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (hasError) {
    return (
      <Card className="w-full border-red-200 bg-red-50">
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <div className="text-lg font-medium">Unable to load mood data</div>
            <div className="text-sm opacity-75">Please try again later</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading || !summary) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">
              Mood Journey
            </CardTitle>
            <Skeleton className="h-4 w-16" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-64 w-full" />
            <div className="flex gap-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-20" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const averageMood =
    chartData.reduce((sum, item) => sum + item.moodValue, 0) / chartData.length;
  const currentMood = chartData[chartData.length - 1]?.mood || "Neutral";

  return (
    <Card className="w-full bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 border-0 shadow-xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Mood Journey
              </CardTitle>
              <div className="text-sm text-gray-600 mt-1">
                Track your emotional evolution through dreams
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendIndicator data={chartData} />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Your mood progression mapped from dreams, showing emotional
                    patterns and trends over time
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        {chartData?.length ? (
          <div className="space-y-6">
            {/* Current Status */}
            <div className="flex items-center justify-between p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{moodScale[currentMood].emoji}</span>
                <div>
                  <div className="font-semibold text-gray-900">
                    Current Mood
                  </div>
                  <div
                    className="text-lg font-bold"
                    style={{ color: moodScale[currentMood].color }}
                  >
                    {currentMood}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Average Level</div>
                <div className="text-xl font-bold text-gray-900">
                  {averageMood.toFixed(1)}/5
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="h-80 w-full p-4 bg-white/40 backdrop-blur-sm rounded-xl border border-white/20">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <defs>
                    <linearGradient
                      id="moodGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.3} />
                      <stop
                        offset="100%"
                        stopColor="#8B5CF6"
                        stopOpacity={0.05}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#E5E7EB"
                    strokeOpacity={0.5}
                  />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#6B7280" }}
                  />
                  <YAxis
                    domain={[1, 5]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#6B7280" }}
                    tickFormatter={(value) => {
                      const moodEntry = Object.entries(moodScale).find(
                        ([_, data]) => data.value === value
                      );
                      return moodEntry ? moodEntry[1].emoji : value;
                    }}
                  />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <ReferenceLine
                    y={3}
                    stroke="#6B7280"
                    strokeDasharray="2 2"
                    strokeOpacity={0.5}
                    label={{ value: "Neutral", position: "right", offset: 10 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="moodValue"
                    stroke="url(#gradient)"
                    strokeWidth={3}
                    fill="url(#moodGradient)"
                    dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 6 }}
                    activeDot={{
                      r: 8,
                      fill: "#8B5CF6",
                      stroke: "#fff",
                      strokeWidth: 2,
                    }}
                    animationDuration={2000}
                    animationEasing="ease-out"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#8B5CF6" />
                      <stop offset="50%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#06B6D4" />
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Mood Scale Legend */}
            <div className="p-4 bg-white/40 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="text-sm font-medium text-gray-700 mb-3">
                Mood Scale
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(moodScale).map(([mood, data]) => (
                  <MoodIndicator
                    key={mood}
                    mood={mood}
                    isActive={hoveredMood === mood}
                    onMouseEnter={() => setHoveredMood(mood)}
                    onMouseLeave={() => setHoveredMood(null)}
                  />
                ))}
              </div>
            </div>

            {/* Insights */}
            {animationComplete && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="text-green-800 font-medium text-sm">
                    Peak Mood
                  </div>
                  <div className="text-green-900 font-bold text-lg">
                    {Object.entries(moodScale).find(
                      ([_, data]) =>
                        data.value ===
                        Math.max(...chartData.map((d) => d.moodValue))
                    )?.[0] || "Unknown"}
                  </div>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="text-blue-800 font-medium text-sm">
                    Total Dreams
                  </div>
                  <div className="text-blue-900 font-bold text-lg">
                    {chartData.length}
                  </div>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <div className="text-purple-800 font-medium text-sm">
                    Mood Stability
                  </div>
                  <div className="text-purple-900 font-bold text-lg">
                    {Math.abs(
                      chartData[chartData.length - 1]?.moodValue -
                        chartData[0]?.moodValue
                    ) <= 1
                      ? "Stable"
                      : "Variable"}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="text-lg font-medium text-gray-900 mb-2">
                Start Your Mood Journey
              </div>
              <div className="text-gray-600 max-w-sm">
                Record your dreams to begin tracking mood patterns and emotional
                insights
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MoodLineChart;

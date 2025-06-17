import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info, Moon, Sun, Calendar, TrendingUp } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";

const emojiToMood = {
  "😨": "Terrified",
  "😢": "Sad",
  "🤩": "Euphoric",
  "😐": "Neutral",
  "😊": "Happy",
};

const moodConfig = {
  Terrified: {
    color: "#8B0000",
    gradient: "from-red-900 to-red-700",
    intensity: 1,
    emoji: "😨",
    label: "Terrified",
  },
  Sad: {
    color: "#5555FF",
    gradient: "from-blue-600 to-blue-400",
    intensity: 0.8,
    emoji: "😢",
    label: "Sad",
  },
  Neutral: {
    color: "#999999",
    gradient: "from-gray-500 to-gray-400",
    intensity: 0.6,
    emoji: "😐",
    label: "Neutral",
  },
  Happy: {
    color: "#4CAF50",
    gradient: "from-green-500 to-green-400",
    intensity: 0.9,
    emoji: "😊",
    label: "Happy",
  },
  Euphoric: {
    color: "#FFB800",
    gradient: "from-yellow-500 to-orange-400",
    intensity: 1,
    emoji: "🤩",
    label: "Euphoric",
  },
};

const generateMockData = () => {
  const data = [];
  const startDate = new Date(new Date().getFullYear(), 0, 1);
  const endDate = new Date();
  const moods = Object.keys(moodConfig);

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    if (Math.random() > 0.7) {
      // 30% chance of having a dream logged
      const count = Math.floor(Math.random() * 3) + 1;
      const mood = moods[Math.floor(Math.random() * moods.length)];
      data.push({
        date: new Date(d).toISOString().split("T")[0],
        count,
        mood,
        intensity: moodConfig[mood].intensity,
      });
    }
  }
  return data;
};

const DreamCalendarHeatmap = ({ summary, loading, hasError }) => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [hoveredDay, setHoveredDay] = useState(null);

  // Use mock data if no summary provided
  const calendarData = useMemo(() => {
    return summary?.calendarData || generateMockData();
  }, [summary]);

  const stats = useMemo(() => {
    const totalDreams = calendarData.reduce(
      (sum, day) => sum + (day.count || 0),
      0
    );
    const totalDays = calendarData.length;
    const moodCounts = calendarData.reduce((acc, day) => {
      if (day.mood) {
        acc[day.mood] = (acc[day.mood] || 0) + 1;
      }
      return acc;
    }, {});

    const dominantMood = Object.entries(moodCounts).reduce(
      (a, b) => (moodCounts[a[0]] > moodCounts[b[0]] ? a : b),
      ["Neutral", 0]
    )[0];

    return { totalDreams, totalDays, moodCounts, dominantMood };
  }, [calendarData]);

  const getWeeksInYear = () => {
    const year = new Date().getFullYear();
    const firstDay = new Date(year, 0, 1);
    const lastDay = new Date(year, 11, 31);
    const dayOfWeek = firstDay.getDay();
    const daysInYear =
      Math.ceil((lastDay - firstDay) / (24 * 60 * 60 * 1000)) + 1;
    return Math.ceil((daysInYear + dayOfWeek) / 7);
  };

  const generateCalendarGrid = () => {
    const weeks = getWeeksInYear();
    const grid = [];
    const startDate = new Date(new Date().getFullYear(), 0, 1);
    const startDay = startDate.getDay();

    // Create data map for quick lookup
    const dataMap = calendarData.reduce((acc, item) => {
      acc[item.date] = item;
      return acc;
    }, {});

    for (let week = 0; week < weeks; week++) {
      const weekData = [];
      for (let day = 0; day < 7; day++) {
        const dayIndex = week * 7 + day - startDay;
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + dayIndex);

        if (
          dayIndex >= 0 &&
          currentDate.getFullYear() === new Date().getFullYear() &&
          currentDate <= new Date()
        ) {
          const dateStr = currentDate.toISOString().split("T")[0];
          const dayData = dataMap[dateStr];
          weekData.push({
            date: dateStr,
            dayOfMonth: currentDate.getDate(),
            dayOfWeek: day,
            data: dayData || null,
            weekIndex: week,
          });
        } else {
          weekData.push(null);
        }
      }
      grid.push(weekData);
    }
    return grid;
  };

  const calendarGrid = generateCalendarGrid();
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  if (loading) {
    return (
      <Card className="w-full bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 border-0 shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-6 w-32" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-40 w-full rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  if (hasError) {
    return (
      <Card className="w-full border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
        <CardContent className="p-6 text-center">
          <div className="text-red-600 dark:text-red-400 text-lg font-medium">
            Unable to load dream calendar
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <Card className="w-full bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 border-0 shadow-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border-b border-white/10">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold flex items-center gap-3 text-slate-800 dark:text-slate-100">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg">
                <Moon className="h-5 w-5 text-white" />
              </div>
              Dream Calendar {new Date().getFullYear()}
            </CardTitle>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer">
                  <Info className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>
                  Visualize your dream logging patterns throughout the year.
                  Colors represent different moods experienced in your dreams.
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-4 border border-white/20"
            >
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm">
                <Calendar className="h-4 w-4" />
                Total Dreams
              </div>
              <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">
                {stats.totalDreams}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-4 border border-white/20"
            >
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm">
                <Sun className="h-4 w-4" />
                Active Days
              </div>
              <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">
                {stats.totalDays}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-4 border border-white/20"
            >
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm">
                <TrendingUp className="h-4 w-4" />
                Avg per Day
              </div>
              <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">
                {stats.totalDays > 0
                  ? (stats.totalDreams / stats.totalDays).toFixed(1)
                  : "0"}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-4 border border-white/20"
            >
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm">
                {moodConfig[stats.dominantMood]?.emoji}
                Dominant Mood
              </div>
              <div className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-1">
                {stats.dominantMood}
              </div>
            </motion.div>
          </div>

          {/* Calendar Grid */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
          >
            {/* Month labels */}
            <div className="flex justify-between mb-4 text-xs font-medium text-slate-600 dark:text-slate-400">
              {months.map((month) => (
                <span key={month}>{month}</span>
              ))}
            </div>

            <div className="flex gap-3">
              {/* Weekday labels */}
              <div className="flex flex-col gap-1">
                {weekdays.map((day) => (
                  <div
                    key={day}
                    className="h-3 w-8 flex items-center justify-center text-xs font-medium text-slate-500 dark:text-slate-400"
                  >
                    {day.slice(0, 1)}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="flex gap-1 overflow-x-auto">
                {calendarGrid.map((week, weekIdx) => (
                  <div key={weekIdx} className="flex flex-col gap-1">
                    {week.map((day, dayIdx) => {
                      if (!day) {
                        return <div key={dayIdx} className="h-3 w-3" />;
                      }

                      const hasData = day.data;

                      const moodInfo = hasData
                        ? moodConfig[emojiToMood[day.data.mood]]
                        : null;

                      return (
                        <Tooltip key={day.date}>
                          <TooltipTrigger asChild>
                            <motion.div
                              className="h-3 w-3 rounded-sm cursor-pointer border border-slate-200 dark:border-slate-700"
                              style={{
                                backgroundColor: hasData
                                  ? moodInfo?.color || "#e5e7eb"
                                  : "#f3f4f6",
                                opacity: hasData
                                  ? 0.8 + day.data.count * 0.2
                                  : 0.3,
                              }}
                              whileHover={{
                                scale: 1.5,
                                zIndex: 10,
                                opacity: 1,
                              }}
                              whileTap={{ scale: 1.2 }}
                              initial={{ opacity: 0 }}
                              animate={{
                                opacity: hasData
                                  ? 0.8 + day.data.count * 0.2
                                  : 0.3,
                              }}
                              transition={{
                                delay: weekIdx * 0.01 + dayIdx * 0.005,
                                duration: 0.3,
                              }}
                              onMouseEnter={() => setHoveredDay(day)}
                              onMouseLeave={() => setHoveredDay(null)}
                              onClick={() => setSelectedDay(day)}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-center space-y-1">
                              <div className="font-medium">
                                {new Date(
                                  day.date + "T00:00:00"
                                ).toLocaleDateString("en-US", {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </div>
                              {hasData ? (
                                <>
                                  <div className="flex items-center gap-1 justify-center">
                                    <span>{moodInfo?.emoji}</span>
                                    <span className="text-sm">
                                      {emojiToMood[day.data.mood]}
                                    </span>
                                  </div>
                                  <div className="text-xs text-slate-600 dark:text-slate-400">
                                    {day.data.count} dream
                                    {day.data.count !== 1 ? "s" : ""}
                                  </div>
                                </>
                              ) : (
                                <div className="text-xs text-slate-500 dark:text-slate-400">
                                  No dreams logged
                                </div>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                <span>Less</span>
                <div className="flex gap-1">
                  {[0.3, 0.5, 0.7, 0.9].map((opacity, idx) => (
                    <div
                      key={idx}
                      className="h-3 w-3 rounded-sm bg-slate-400"
                      style={{ opacity }}
                    />
                  ))}
                </div>
                <span>More</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {Object.entries(moodConfig).map(([mood, config]) => (
                  <Badge
                    key={mood}
                    variant="secondary"
                    className="flex items-center gap-1 text-xs"
                    style={{
                      backgroundColor: `${config.color}20`,
                      color: config.color,
                      border: `1px solid ${config.color}40`,
                    }}
                  >
                    <span>{config.emoji}</span>
                    <span>{config.label}</span>
                  </Badge>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Selected Day Detail */}
          <AnimatePresence>
            {selectedDay && selectedDay.data && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm rounded-xl p-4 border border-purple-200/20"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">
                      {moodConfig[selectedDay.data.mood]?.emoji}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-slate-100">
                        {new Date(
                          selectedDay.date + "T00:00:00"
                        ).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        {selectedDay.data.count} dream
                        {selectedDay.data.count !== 1 ? "s" : ""} •{" "}
                        {selectedDay.data.mood} mood
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedDay(null)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    ×
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default DreamCalendarHeatmap;

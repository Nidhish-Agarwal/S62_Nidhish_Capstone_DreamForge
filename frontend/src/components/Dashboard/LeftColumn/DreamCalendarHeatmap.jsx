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

const DreamCalendarHeatmap = ({ summary, loading, hasError }) => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [hoveredDay, setHoveredDay] = useState(null);

  // Use mock data if no summary provided
  const calendarData = summary?.calendarData;

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
      <div className="w-full max-w-full overflow-hidden">
        <Card className="w-full bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 border-0 shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-6 w-32" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))}
            </div>
            <Skeleton className="h-40 w-full rounded-lg" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="w-full max-w-full overflow-hidden">
        <Card className="w-full border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
          <CardContent className="p-6 text-center">
            <div className="text-red-600 dark:text-red-400 text-lg font-medium">
              Unable to load dream calendar
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full overflow-hidden">
      <TooltipProvider>
        <Card className="w-full bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border-b border-white/10">
            <div className="flex items-center justify-between min-w-0">
              <CardTitle className="text-lg md:text-xl font-bold flex items-center gap-3 text-slate-800 dark:text-slate-100 min-w-0 truncate">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex-shrink-0">
                  <Moon className="h-4 w-4 md:h-5 md:w-5 text-white" />
                </div>
                <span className="hidden sm:inline truncate">
                  Dream Calendar {new Date().getFullYear()}
                </span>
                <span className="sm:hidden truncate">
                  Dreams {new Date().getFullYear()}
                </span>
              </CardTitle>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer flex-shrink-0">
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

          <CardContent className="p-3 md:p-6 space-y-4 md:space-y-6 overflow-hidden">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 w-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-white/20 min-w-0"
              >
                <div className="flex items-center gap-1 md:gap-2 text-slate-600 dark:text-slate-400 text-xs md:text-sm min-w-0">
                  <Calendar className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                  <span className="hidden sm:inline truncate">
                    Total Dreams
                  </span>
                  <span className="sm:hidden truncate">Dreams</span>
                </div>
                <div className="text-lg md:text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1 truncate">
                  {stats.totalDreams}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-white/20 min-w-0"
              >
                <div className="flex items-center gap-1 md:gap-2 text-slate-600 dark:text-slate-400 text-xs md:text-sm min-w-0">
                  <Sun className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                  <span className="hidden sm:inline truncate">Active Days</span>
                  <span className="sm:hidden truncate">Days</span>
                </div>
                <div className="text-lg md:text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1 truncate">
                  {stats.totalDays}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-white/20 min-w-0"
              >
                <div className="flex items-center gap-1 md:gap-2 text-slate-600 dark:text-slate-400 text-xs md:text-sm min-w-0">
                  <TrendingUp className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                  <span className="hidden sm:inline truncate">Avg per Day</span>
                  <span className="sm:hidden truncate">Avg</span>
                </div>
                <div className="text-lg md:text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1 truncate">
                  {stats.totalDays > 0
                    ? (stats.totalDreams / stats.totalDays).toFixed(1)
                    : "0"}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-white/20 min-w-0"
              >
                <div className="flex items-center gap-1 md:gap-2 text-slate-600 dark:text-slate-400 text-xs md:text-sm min-w-0">
                  <span className="flex-shrink-0">
                    {moodConfig[stats.dominantMood]?.emoji}
                  </span>
                  <span className="hidden sm:inline truncate">
                    Dominant Mood
                  </span>
                  <span className="sm:hidden truncate">Mood</span>
                </div>
                <div className="text-sm md:text-lg font-bold text-slate-800 dark:text-slate-100 mt-1 truncate">
                  {stats.dominantMood}
                </div>
              </motion.div>
            </div>

            {/* Calendar Grid */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-3 md:p-6 border border-white/20 w-full"
            >
              {/* Month labels - Hide on very small screens */}
              <div className="hidden sm:flex justify-between mb-4 text-xs font-medium text-slate-600 dark:text-slate-400">
                {months.map((month) => (
                  <span key={month} className="flex-shrink-0">
                    {month}
                  </span>
                ))}
              </div>

              {/* Calendar container with proper scrolling */}
              <div className="w-full">
                <div className="flex gap-1 md:gap-3 w-full">
                  {/* Weekday labels */}
                  <div className="flex flex-col gap-0.5 md:gap-1 flex-shrink-0">
                    {weekdays.map((day) => (
                      <div
                        key={day}
                        className="h-2 w-3 md:h-3 md:w-6 flex items-center justify-center text-xs font-medium text-slate-500 dark:text-slate-400"
                      >
                        {day.slice(0, 1)}
                      </div>
                    ))}
                  </div>

                  {/* Calendar grid with contained horizontal scroll */}
                  <div className="flex-1 min-w-0 overflow-x-auto overflow-y-hidden">
                    <div className="flex gap-0.5 md:gap-1 w-max">
                      {calendarGrid.map((week, weekIdx) => (
                        <div
                          key={weekIdx}
                          className="flex flex-col gap-0.5 md:gap-1 flex-shrink-0"
                        >
                          {week.map((day, dayIdx) => {
                            if (!day) {
                              return (
                                <div
                                  key={dayIdx}
                                  className="h-2 w-2 md:h-3 md:w-3 flex-shrink-0"
                                />
                              );
                            }

                            const hasData = day.data;
                            const moodInfo = hasData
                              ? moodConfig[emojiToMood[day.data.mood]]
                              : null;

                            return (
                              <Tooltip key={day.date}>
                                <TooltipTrigger asChild>
                                  <motion.div
                                    className="h-2 w-2 md:h-3 md:w-3 rounded-sm cursor-pointer border border-slate-200 dark:border-slate-700 flex-shrink-0"
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
                </div>
              </div>

              {/* Legend */}
              <div className="mt-4 md:mt-6 w-full overflow-hidden">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 min-w-0">
                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 flex-shrink-0">
                    <span>Less</span>
                    <div className="flex gap-1">
                      {[0.3, 0.5, 0.7, 0.9].map((opacity, idx) => (
                        <div
                          key={idx}
                          className="h-2 w-2 md:h-3 md:w-3 rounded-sm bg-slate-400 flex-shrink-0"
                          style={{ opacity }}
                        />
                      ))}
                    </div>
                    <span>More</span>
                  </div>

                  <div className="flex flex-wrap gap-1 md:gap-2 min-w-0">
                    {Object.entries(moodConfig).map(([mood, config]) => (
                      <Badge
                        key={mood}
                        variant="secondary"
                        className="flex items-center gap-1 text-xs px-2 py-1 flex-shrink-0"
                        style={{
                          backgroundColor: `${config.color}20`,
                          color: config.color,
                          border: `1px solid ${config.color}40`,
                        }}
                      >
                        <span>{config.emoji}</span>
                        <span className="hidden sm:inline">{config.label}</span>
                      </Badge>
                    ))}
                  </div>
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
                  className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm rounded-xl p-4 border border-purple-200/20 w-full overflow-hidden"
                >
                  <div className="flex items-center justify-between min-w-0">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="text-2xl flex-shrink-0">
                        {moodConfig[selectedDay.data.mood]?.emoji}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-slate-800 dark:text-slate-100 text-sm md:text-base truncate">
                          {new Date(
                            selectedDay.date + "T00:00:00"
                          ).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                        <div className="text-xs md:text-sm text-slate-600 dark:text-slate-400 truncate">
                          {selectedDay.data.count} dream
                          {selectedDay.data.count !== 1 ? "s" : ""} •{" "}
                          {selectedDay.data.mood} mood
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedDay(null)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors text-lg flex-shrink-0"
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
    </div>
  );
};

export default DreamCalendarHeatmap;

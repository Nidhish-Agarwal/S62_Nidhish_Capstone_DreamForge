import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Smile,
  Sparkles,
  Star,
  Moon,
  Cloud,
  Brain,
  Compass,
  Calendar,
} from "lucide-react";

export default function MysticalDreamSummary({ loading, summary, hasError }) {
  // Mock data for demonstration
  const mockSummary = summary || {
    totalDreams: 42,
    averageMood: "Peaceful",
    topSymbol: "Flying",
    commonTheme: "Adventure",
    totalDreamsThisMonth: 18,
  };

  if (hasError) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-red-900/30 to-pink-900/30 backdrop-blur-xl border border-red-300/20 rounded-3xl p-8 text-center"
      >
        <Cloud className="h-16 w-16 text-red-400 mx-auto mb-4 animate-bounce" />
        <h1 className="text-red-300 text-xl font-bold">
          The dream realm is clouded...
        </h1>
        <p className="text-red-200/70 mt-2">Something mystical went wrong</p>
      </motion.div>
    );
  }

  if (loading || !summary) {
    return (
      <div className="relative">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/30 to-pink-900/20 animate-pulse rounded-3xl" />

        <Card className="relative bg-black/40 backdrop-blur-xl border border-white/10 text-white shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="text-2xl font-bold tracking-wide text-purple-100 text-center py-8">
            <div className="flex items-center justify-center gap-3">
              <Moon className="h-8 w-8 animate-spin text-purple-300" />
              Dream Realm Summary
              <Sparkles className="h-8 w-8 animate-pulse text-yellow-300" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6 p-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full bg-white/10" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-full bg-white/10 rounded-full" />
                  <Skeleton className="h-3 w-2/3 bg-white/10 rounded-full" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  const dreamStats = [
    {
      icon: Brain,
      label: "Total Dreams",
      value: mockSummary.totalDreams,
      color: "from-purple-400 to-indigo-500",
      glowColor: "rgba(147, 51, 234, 0.5)",
      animation: "animate-pulse",
    },
    {
      icon: Calendar,
      label: "This Month",
      value: mockSummary.totalDreamsThisMonth,
      color: "from-emerald-400 to-green-500",
      glowColor: "rgba(34, 197, 94, 0.5)",
      animation: "animate-pulse",
    },
  ];

  const dreamInsights = [
    {
      icon: Smile,
      label: "Average Mood",
      value: mockSummary.averageMood,
      color: "text-emerald-300",
      bgColor: "bg-emerald-500/20",
      borderColor: "border-emerald-400/30",
    },
    {
      icon: Eye,
      label: "Top Symbol",
      value: mockSummary.topSymbol,
      color: "text-cyan-300",
      bgColor: "bg-cyan-500/20",
      borderColor: "border-cyan-400/30",
    },
    {
      icon: Compass,
      label: "Common Theme",
      value: mockSummary.commonTheme,
      color: "text-amber-300",
      bgColor: "bg-amber-500/20",
      borderColor: "border-amber-400/30",
    },
  ];

  return (
    <div className="relative min-h-[600px]">
      {/* Animated cosmic background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 rounded-3xl" />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 1, 0.3],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <Card className="relative bg-black/20 backdrop-blur-xl border-0 text-white shadow-2xl rounded-3xl overflow-hidden">
        {/* Header with animated title */}
        <CardHeader className="text-center py-8 relative">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center gap-4 mb-2"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Moon className="h-10 w-10 text-purple-300 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
            </motion.div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-200 via-pink-200 to-indigo-200 bg-clip-text text-transparent tracking-wider">
              Dream Realm Chronicle
            </h1>
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="h-10 w-10 text-yellow-300 drop-shadow-[0_0_10px_rgba(253,224,71,0.8)]" />
            </motion.div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-purple-200/80 text-lg font-medium"
          >
            Your mystical journey through the realm of dreams
          </motion.p>
        </CardHeader>

        <CardContent className="p-8 space-y-8">
          {/* Dream Statistics Grid */}
          <div className="grid grid-cols-2 gap-6">
            {dreamStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl blur-xl" />
                <div className="relative bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl p-6 text-center hover:border-white/20 transition-all duration-300">
                  <div
                    className={`inline-flex p-3 rounded-full bg-gradient-to-r ${stat.color} mb-4 ${stat.animation}`}
                    style={{ boxShadow: `0 0 20px ${stat.glowColor}` }}
                  >
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-white/70 font-medium">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Dream Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold text-center text-purple-200 mb-6 flex items-center justify-center gap-2">
              <Star className="h-6 w-6 text-yellow-300 animate-spin" />
              Dream Insights
              <Star
                className="h-6 w-6 text-yellow-300 animate-spin"
                style={{ animationDirection: "reverse" }}
              />
            </h3>

            <div className="grid gap-4">
              {dreamInsights.map((insight, index) => (
                <motion.div
                  key={insight.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className={`flex items-center gap-4 p-4 rounded-2xl ${insight.bgColor} border ${insight.borderColor} backdrop-blur-sm hover:backdrop-blur-md transition-all duration-300`}
                >
                  <div className="flex-shrink-0">
                    <insight.icon
                      className={`h-6 w-6 ${insight.color} animate-pulse`}
                    />
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-white/90 font-medium">
                      {insight.label}:
                    </span>
                    <Badge
                      variant="outline"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition-colors"
                    >
                      {insight.value}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Mystical footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="text-center pt-6 border-t border-white/10"
          >
            <p className="text-purple-200/60 text-sm italic">
              "Dreams are the windows to our soul's deepest mysteries"
            </p>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}

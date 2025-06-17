import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Clock,
  Moon,
  Calendar,
  Star,
  Zap,
  CloudRain,
  Loader2,
} from "lucide-react";

const dreamPersonalityTypes = {
  dpt_visionary: {
    name: "The Visionary",
    emoji: "👁️",
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-gradient-to-br from-purple-50 to-pink-50",
    traits: ["creative", "introspective", "idealistic", "spiritual"],
  },
  dpt_wanderer: {
    name: "The Wanderer",
    emoji: "🗺️",
    color: "from-blue-500 to-teal-500",
    bgColor: "bg-gradient-to-br from-blue-50 to-teal-50",
    traits: ["curious", "independent", "restless", "thoughtful"],
  },
  dpt_guardian: {
    name: "The Guardian",
    emoji: "🛡️",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-gradient-to-br from-green-50 to-emerald-50",
    traits: ["empathetic", "protective", "loyal", "self-sacrificing"],
  },
  dpt_shadow_walker: {
    name: "The Shadow Walker",
    emoji: "🌑",
    color: "from-gray-700 to-purple-800",
    bgColor: "bg-gradient-to-br from-gray-100 to-purple-100",
    traits: ["deep", "emotional", "brave", "complex"],
  },
  dpt_illusionist: {
    name: "The Illusionist",
    emoji: "🎭",
    color: "from-indigo-500 to-purple-600",
    bgColor: "bg-gradient-to-br from-indigo-50 to-purple-50",
    traits: ["mystical", "imaginative", "enigmatic", "unpredictable"],
  },
  dpt_healer: {
    name: "The Healer",
    emoji: "✨",
    color: "from-emerald-400 to-cyan-400",
    bgColor: "bg-gradient-to-br from-emerald-50 to-cyan-50",
    traits: ["compassionate", "sensitive", "peace-seeking", "wise"],
  },
  dpt_seeker: {
    name: "The Seeker",
    emoji: "🔍",
    color: "from-amber-500 to-orange-500",
    bgColor: "bg-gradient-to-br from-amber-50 to-orange-50",
    traits: ["philosophical", "spiritual", "analytical", "curious"],
  },
  dpt_trickster: {
    name: "The Trickster",
    emoji: "🃏",
    color: "from-red-500 to-pink-500",
    bgColor: "bg-gradient-to-br from-red-50 to-pink-50",
    traits: ["clever", "rebellious", "chaotic", "sharp-minded"],
  },
  dpt_architect: {
    name: "The Architect",
    emoji: "🏗️",
    color: "from-slate-500 to-blue-600",
    bgColor: "bg-gradient-to-br from-slate-50 to-blue-50",
    traits: ["analytical", "grounded", "methodical", "creative"],
  },
  dpt_echo: {
    name: "The Echo",
    emoji: "🌊",
    color: "from-cyan-500 to-blue-500",
    bgColor: "bg-gradient-to-br from-cyan-50 to-blue-50",
    traits: ["intuitive", "sensitive", "reflective", "emotional"],
  },
};

const moodConfig = {
  Terrified: { emoji: "😨", color: "bg-red-100 text-red-800 border-red-200" },
  Sad: { emoji: "😢", color: "bg-blue-100 text-blue-800 border-blue-200" },
  Neutral: { emoji: "😐", color: "bg-gray-100 text-gray-800 border-gray-200" },
  Happy: {
    emoji: "😊",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  Euphoric: { emoji: "🤩", color: "bg-pink-100 text-pink-800 border-pink-200" },
};

const statusConfig = {
  pending: { icon: Clock, color: "bg-orange-100 text-orange-800" },
  processing: { icon: Zap, color: "bg-blue-100 text-blue-800" },
  completed: { icon: Star, color: "bg-green-100 text-green-800" },
  failed: { icon: CloudRain, color: "bg-red-100 text-red-800" },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const RecentDreamsWidget = ({ dreams = [], loading = false, error = null }) => {
  return (
    <motion.div variants={itemVariants} className="space-y-4">
      <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-xl">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-700">
            <Moon className="w-5 h-5 text-purple-500" />
            Recent Dreams
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-80">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                <span className="ml-2 text-slate-500">Loading dreams...</span>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">
                <CloudRain className="w-12 h-12 mx-auto mb-2" />
                <p className="font-medium">Error loading dreams</p>
                <p className="text-sm text-slate-500 mt-1">{error}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {dreams.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <Moon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No dreams recorded yet</p>
                  </div>
                ) : (
                  dreams.map((dream, index) => {
                    const mood = moodConfig[dream.mood] || moodConfig.Neutral;
                    const status =
                      statusConfig[dream.analysis_status] ||
                      statusConfig.pending;
                    const StatusIcon = status.icon;

                    return (
                      <motion.div
                        key={dream._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{
                          scale: 1.02,
                          transition: { duration: 0.2 },
                        }}
                        className="group cursor-pointer"
                      >
                        <Card className="border border-slate-200 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-medium text-slate-800 group-hover:text-purple-600 transition-colors">
                                {dream.title}
                              </h4>
                              <div className="flex gap-2">
                                <Badge
                                  className={`${mood.color} border text-xs`}
                                >
                                  {mood.emoji} {dream.mood}
                                </Badge>
                                <Badge className={`${status.color} text-xs`}>
                                  <StatusIcon className="w-3 h-3 mr-1" />
                                  {dream.analysis_status}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-sm text-slate-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(dream.date).toLocaleDateString()}
                              </span>
                              {dream.dream_personality_type &&
                                dreamPersonalityTypes[
                                  dream.dream_personality_type.type
                                ] && (
                                  <span className="text-xs bg-slate-100 px-2 py-1 rounded-full">
                                    {
                                      dreamPersonalityTypes[
                                        dream.dream_personality_type.type
                                      ].emoji
                                    }
                                    {
                                      dreamPersonalityTypes[
                                        dream.dream_personality_type.type
                                      ].name
                                    }
                                  </span>
                                )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })
                )}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RecentDreamsWidget;

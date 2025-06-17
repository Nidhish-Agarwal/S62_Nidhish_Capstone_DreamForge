import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Loader2, CloudRain } from "lucide-react";

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

const MostFrequentDPTWidget = ({ dptData, loading = false, error = null }) => {
  return (
    <motion.div variants={itemVariants}>
      <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-xl overflow-hidden relative">
        <CardHeader className="pb-3 relative z-10">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-700">
            <Brain className="w-5 h-5 text-indigo-500" />
            Most Frequent Dream Personality
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
              <span className="ml-2 text-slate-500">
                Loading personality data...
              </span>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              <CloudRain className="w-12 h-12 mx-auto mb-2" />
              <p className="font-medium">Error loading personality data</p>
              <p className="text-sm text-slate-500 mt-1">{error}</p>
            </div>
          ) : !dptData || !dptData.id ? (
            <div className="text-center py-8 text-slate-500">
              <Brain className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No personality types analyzed yet</p>
            </div>
          ) : (
            (() => {
              const dpt = dreamPersonalityTypes[dptData.id];

              if (!dpt) {
                return (
                  <div className="text-center py-8 text-slate-500">
                    <p>Unknown personality type: {dptData.id}</p>
                  </div>
                );
              }

              return (
                <>
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${dpt.color} opacity-5`}
                  />
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="relative p-6 rounded-2xl bg-gradient-to-br from-white/80 to-white/40 border border-white/50"
                  >
                    <div className="text-center mb-4">
                      <motion.div
                        className="text-6xl mb-3"
                        animate={{
                          rotate: [0, 5, -5, 0],
                          scale: [1, 1.05, 1],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 4,
                          ease: "easeInOut",
                        }}
                      >
                        {dpt.emoji}
                      </motion.div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2">
                        {dpt.name}
                      </h3>
                      <Badge
                        className={`bg-gradient-to-r ${dpt.color} text-white border-0 px-3 py-1`}
                      >
                        Appeared {dptData.count} times
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-2 justify-center">
                      {dpt.traits.map((trait, index) => (
                        <motion.div
                          key={trait}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <Badge
                            variant="outline"
                            className="bg-white/70 hover:bg-white/90 transition-colors"
                          >
                            {trait}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>

                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-r ${dpt.color} opacity-10 rounded-2xl`}
                      animate={{
                        scale: [1, 1.02, 1],
                        opacity: [0.1, 0.15, 0.1],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 3,
                        ease: "easeInOut",
                      }}
                    />
                  </motion.div>
                </>
              );
            })()
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MostFrequentDPTWidget;

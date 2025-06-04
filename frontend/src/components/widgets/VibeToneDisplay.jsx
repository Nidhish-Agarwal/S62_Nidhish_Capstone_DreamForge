import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import React from "react";

const vibeColors = {
  calm: "bg-blue-500/40",
  quiet: "bg-blue-300/30",
  eerie: "bg-purple-500/30",
  joyful: "bg-yellow-400/40",
  dreamy: "bg-pink-500/30",
  intense: "bg-red-500/40",
  default: "bg-pink-400/40",
};

const vibeIcons = {
  calm: "🕊️",
  quiet: "🤫",
  eerie: "🌫️",
  joyful: "☀️",
  dreamy: "🌙",
  intense: "🔥",
  default: "✨",
};

const shimmerStyle = {
  backgroundImage:
    "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
  backgroundSize: "200% 100%",
  animation: "shimmer 2s infinite",
};

const VibeToneDisplay = ({ vibe }) => {
  if (!vibe || (!vibe.tone && !vibe.keywords?.length)) return null;

  return (
    <section>
      <h2 className="text-xl font-semibold mb-2 text-white">🎼 Vibe & Tone</h2>

      <div className="bg-white/10 p-4 rounded-2xl backdrop-blur shadow-inner">
        {/* Animated Typewriter Text */}
        {vibe.keywords?.length > 0 && (
          <div className="text-white mb-3">
            <TypeAnimation
              sequence={vibe.keywords.flatMap((word) => [word, 3000])}
              speed={20}
              deletionSpeed={20}
              repeat={Infinity}
              className="text-md font-medium tracking-wide"
            />
          </div>
        )}

        {/* Badges with shimmer & emoji */}
        {vibe.keywords?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {vibe.keywords.map((word) => {
              const key = word.toLowerCase();
              const bgColor = vibeColors[key] || vibeColors.default;
              const icon = vibeIcons[key] || vibeIcons.default;

              return (
                <motion.div
                  key={word}
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <Badge
                    className={`text-white text-xs rounded-full px-3 py-1 ${bgColor} backdrop-blur-md font-medium shimmer-badge`}
                    style={shimmerStyle}
                  >
                    {icon} {word}
                  </Badge>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Tone */}
        {vibe.tone && (
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm italic text-pink-200 font-serif mt-4"
          >
            “{vibe.tone}”
          </motion.p>
        )}
      </div>

      {/* Shimmer animation keyframes */}
      <style>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </section>
  );
};

export default VibeToneDisplay;

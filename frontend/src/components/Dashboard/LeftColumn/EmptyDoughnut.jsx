import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Sparkles, Moon, Stars, Heart } from "lucide-react";
import { motion } from "framer-motion";

export default function EmptyStateUI() {
  return (
    <div className="relative min-h-[500px]">
      {/* Animated cosmic background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 rounded-3xl" />

      {/* Floating mystical particles */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/60 rounded-full"
            initial={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0, 1, 0],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Orbiting elements */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="relative w-80 h-80"
        >
          {[Moon, Stars, Heart].map((Icon, i) => (
            <motion.div
              key={i}
              className="absolute w-8 h-8 flex items-center justify-center"
              style={{
                left: "50%",
                top: "50%",
                transform: `translate(-50%, -50%) rotate(${
                  i * 120
                }deg) translateY(-140px)`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.7,
              }}
            >
              <Icon className="w-full h-full text-purple-300/70" />
            </motion.div>
          ))}
        </motion.div>
      </div>

      <Card className="relative bg-black/20 backdrop-blur-xl border-0 text-white shadow-2xl rounded-3xl overflow-hidden">
        <CardHeader className="text-center py-8 relative">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center gap-3 mb-4"
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
        </CardHeader>

        <CardContent className="p-8 text-center">
          {/* Central Brain with Pulsing Effect */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative mb-8 flex items-center justify-center"
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative"
            >
              {/* Glowing ring effect */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 w-32 h-32 rounded-full border-2 border-purple-400/30 border-dashed"
                style={{
                  filter: "drop-shadow(0 0 20px rgba(147, 51, 234, 0.4))",
                }}
              />

              {/* Brain icon */}
              <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-md border border-white/10 flex items-center justify-center">
                <Brain className="w-16 h-16 text-purple-300 drop-shadow-[0_0_15px_rgba(147,51,234,0.6)]" />
              </div>
            </motion.div>
          </motion.div>

          {/* Main Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="space-y-4 mb-8"
          >
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
              Your Emotional Realm Awaits
            </h2>
            <p className="text-purple-200/80 text-lg max-w-md mx-auto leading-relaxed">
              The cosmos of your inner world is ready to be explored, but no
              dreams have been captured yet.
            </p>
          </motion.div>

          {/* Animated Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="space-y-4 mb-8"
          >
            {[
              { icon: Moon, text: "Begin your dream journal", delay: 1.2 },
              {
                icon: Sparkles,
                text: "Capture your nocturnal visions",
                delay: 1.4,
              },
              {
                icon: Heart,
                text: "Unveil your emotional patterns",
                delay: 1.6,
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: step.delay, duration: 0.6 }}
                className="flex items-center gap-4 justify-center group"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-all"
                >
                  <step.icon className="w-5 h-5 text-purple-300" />
                </motion.div>
                <span className="text-purple-200/70 font-medium group-hover:text-purple-200 transition-colors">
                  {step.text}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}

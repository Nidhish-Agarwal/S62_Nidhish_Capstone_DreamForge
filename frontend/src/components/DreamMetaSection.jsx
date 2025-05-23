import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AlertCircle, ExternalLink, Sparkles } from "lucide-react";
import { useMemo } from "react";
import Lottie from "lottie-react";
import dreamyParticles from "../assets/lotties/sparkle.json";

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1 },
  }),
};

const DreamMetaSection = ({ dream }) => {
  const {
    symbols = [],
    themes = [],
    characters = [],
    setting = [],
    notes_to_ai,
    real_life_link,
  } = dream;

  const shouldRender =
    symbols.length ||
    themes.length ||
    characters.length ||
    setting.length ||
    notes_to_ai ||
    real_life_link;

  const displayData = useMemo(() => {
    return [
      {
        label: "Symbols",
        icon: <Sparkles className="text-yellow-300" />,
        data: symbols,
      },
      {
        label: "Themes",
        icon: <span className="text-pink-400">🎭</span>,
        data: themes,
      },
      {
        label: "Characters",
        icon: <span className="text-indigo-400">🧑‍🤝‍🧑</span>,
        data: characters,
      },
      {
        label: "Setting",
        icon: <span className="text-green-400">🌄</span>,
        data: setting,
      },
    ];
  }, [symbols, themes, characters, setting]);

  if (!shouldRender) return null;

  return (
    <div className="relative mt-6 bg-white/5 rounded-2xl p-6 border border-white/10">
      <Lottie
        animationData={dreamyParticles}
        loop
        autoplay
        className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none z-0"
      />

      <motion.h2
        className="text-2xl font-bold mb-4 relative z-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        🧩 Dream Metadata
      </motion.h2>

      <div className="space-y-4 relative z-10">
        <AnimatePresence>
          {displayData.map((section, i) =>
            section.data.length ? (
              <motion.div
                key={section.label}
                className=""
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                custom={i}
              >
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
                  {section.icon} {section.label}
                </h3>

                <div className="flex gap-2 flex-wrap">
                  {section.data.map((item, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: idx * 0.03 }}
                    >
                      <Badge className="bg-white/10 text-white backdrop-blur-md">
                        {item}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : null
          )}
        </AnimatePresence>

        {notes_to_ai && (
          <motion.div
            className="mt-4 bg-black/20 p-4 rounded-lg flex gap-3 items-start"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <AlertCircle className="text-yellow-300 mt-1" />
            <div>
              <h3 className="font-semibold">Note to AI</h3>
              <p className="text-sm text-white/90">{notes_to_ai}</p>
            </div>
          </motion.div>
        )}

        {real_life_link && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-white/10 p-4 rounded-xl mt-6"
          >
            <h3 className="text-md font-semibold text-white mb-1">
              🧠 Real-Life Context
            </h3>
            <p className="text-sm text-gray-200">{real_life_link}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DreamMetaSection;

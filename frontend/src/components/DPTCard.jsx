import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import DreamPersonalityTypes from "../data/DreamPersonalityTypes.json";
import { Info } from "lucide-react";
import Lottie from "lottie-react";
import sparkle from "../assets/lotties/sparkle.json";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

const TraitInfoMap = {
  creative: {
    label: "Creative",
    description:
      "You can shape your own dream worlds. Imagination fuels your subconscious.",
    emoji: "🎨",
  },
  introspective: {
    label: "Introspective",
    description:
      "You turn inward and examine your emotions, thoughts, and patterns.",
    emoji: "🧘",
  },
  idealistic: {
    label: "Idealistic",
    description: "You seek perfection or higher meaning — even in dreams.",
    emoji: "🌈",
  },
  spiritual: {
    label: "Spiritual",
    description:
      "You sense something beyond the visible. Symbols and signs speak to you.",
    emoji: "🔮",
  },
  curious: {
    label: "Curious",
    description:
      "You explore your dreamworld like an adventurer seeking truth.",
    emoji: "🧭",
  },
  independent: {
    label: "Independent",
    description:
      "You navigate dreams on your own terms — bold and self-directed.",
    emoji: "🦅",
  },
  restless: {
    label: "Restless",
    description:
      "You're always moving — mentally, emotionally, or literally in dreams.",
    emoji: "🏃‍♂️",
  },
  thoughtful: {
    label: "Thoughtful",
    description: "You reflect deeply and your dreams echo layered thinking.",
    emoji: "💭",
  },
  protective: {
    label: "Protective",
    description: "You guard others or parts of yourself in dream states.",
    emoji: "🛡️",
  },
  loyal: {
    label: "Loyal",
    description:
      "You show devotion in your dreams — to people, symbols, or truths.",
    emoji: "🤝",
  },
  self_sacrificing: {
    label: "Self-Sacrificing",
    description: "You may prioritize others even in your unconscious mind.",
    emoji: "🔥",
  },
  emotional: {
    label: "Emotional",
    description:
      "You feel deeply. Your dreams often reflect internal emotional tides.",
    emoji: "🌊",
  },
  brave: {
    label: "Brave",
    description: "You face inner fears and shadow aspects head-on in dreams.",
    emoji: "🦁",
  },
  complex: {
    label: "Complex",
    description:
      "Your dream world isn’t black and white — it’s layered and nuanced.",
    emoji: "🧩",
  },
  mystical: {
    label: "Mystical",
    description: "You walk between reality and mystery in your dreams.",
    emoji: "🌌",
  },
  imaginative: {
    label: "Imaginative",
    description:
      "You create new dimensions. Your dreams aren't bound by rules.",
    emoji: "🪄",
  },
  enigmatic: {
    label: "Enigmatic",
    description: "Even your dreams leave clues. You’re hard to decode.",
    emoji: "🧠❓",
  },
  unpredictable: {
    label: "Unpredictable",
    description: "Dreams take sudden turns — like your mind’s own plot twist.",
    emoji: "🔀",
  },
  compassionate: {
    label: "Compassionate",
    description: "You show care and healing toward others in your dreams.",
    emoji: "💗",
  },
  sensitive: {
    label: "Sensitive",
    description: "You're tuned to emotional undercurrents — yours and others'.",
    emoji: "🌫️",
  },
  peace_seeking: {
    label: "Peace-Seeking",
    description: "You bring calm or resolve chaos in dreams.",
    emoji: "🕊️",
  },
  wise: {
    label: "Wise",
    description: "You dream with ancient insight or symbolic truths.",
    emoji: "🦉",
  },
  philosophical: {
    label: "Philosophical",
    description:
      "You question existence even in your sleep. Your dreams ponder.",
    emoji: "🤔",
  },
  analytical: {
    label: "Analytical",
    description:
      "You examine dreams like puzzles — decoding layers of meaning.",
    emoji: "📊",
  },
  rebellious: {
    label: "Rebellious",
    description: "You reject norms, even in the surreal world of dreams.",
    emoji: "⚡",
  },
  chaotic: {
    label: "Chaotic",
    description: "Unpredictable dreamscapes mirror your wild creative mind.",
    emoji: "🌀",
  },
  sharp_minded: {
    label: "Sharp-Minded",
    description: "Your dream logic may be weird — but it’s clever.",
    emoji: "🧠",
  },
  grounded: {
    label: "Grounded",
    description:
      "Even in dreams, you stay rooted in inner structure or values.",
    emoji: "🌳",
  },
  methodical: {
    label: "Methodical",
    description: "Your dreams follow patterns, like blueprints of your mind.",
    emoji: "📐",
  },
  intuitive: {
    label: "Intuitive",
    description:
      "You just *know* — without knowing how. Your dreams follow gut feeling.",
    emoji: "🌙✨",
  },
  reflective: {
    label: "Reflective",
    description: "You absorb and echo what’s unresolved or unspoken.",
    emoji: "🪞",
  },
};

// Helper to format type and get details
const getDPTDetails = (typeId) => {
  const formattedId = typeId.toLowerCase().replace(/\s+/g, "_");
  return DreamPersonalityTypes.find((t) => t.id === formattedId);
};

const getGradient = (type) => {
  switch (type) {
    case "dpt_visionary":
      return "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500";
    case "dpt_wanderer":
      return "bg-gradient-to-br from-blue-400 via-teal-400 to-green-300";
    case "dpt_shadow_walker":
      return "bg-gradient-to-br from-gray-800 via-gray-700 to-black";
    case "dpt_trickster":
      return "bg-gradient-to-br from-yellow-500 via-pink-500 to-red-400";
    case "dpt_healer":
      return "bg-gradient-to-br from-teal-300 via-emerald-300 to-green-200";
    case "dpt_echo":
      return "bg-gradient-to-br from-rose-400 via-pink-400 to-fuchsia-500";
    case "dpt_guardian":
      return "bg-gradient-to-br from-yellow-300 via-orange-300 to-red-200";
    default:
      return "bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600";
  }
};

export function DPTCard({ DPT }) {
  const typeId = DPT.type;
  const dpt = getDPTDetails(typeId);
  if (!dpt) return null;

  const gradient = getGradient(typeId);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 80 }}
      className={cn(
        "relative rounded-2xl p-6 overflow-hidden shadow-lg",
        gradient,
        "text-white"
      )}
    >
      {/* Sparkle animation */}
      <Lottie
        animationData={sparkle}
        loop
        autoplay
        className="absolute top-0 right-0 w-28 opacity-70 pointer-events-none"
      />

      {/* Header */}
      <div className="flex items-center gap-2 mb-3 z-10 relative">
        <h2 className="text-2xl font-bold drop-shadow">🧠 {dpt.name}</h2>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="w-4 h-4 text-white/80" />
            </TooltipTrigger>
            <TooltipContent side="top" className="text-sm max-w-xs">
              Based on Jungian dream symbols and patterns, this personality
              represents how your subconscious processes themes.
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Description */}
      <p className="mb-4 italic text-white/90 text-sm leading-relaxed z-10 relative">
        {dpt.short_description}
      </p>

      {/* Traits */}
      <div className="flex flex-wrap gap-2 z-50 relative">
        {dpt.traits.map((trait, i) => {
          const info = TraitInfoMap[trait];
          if (!info) return null;

          return (
            <HoverCard key={i}>
              <HoverCardTrigger asChild>
                <button className="bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 cursor-pointer text-xs px-3 py-1 hover:scale-105 transition rounded-full">
                  {info.emoji} {info.label}
                </button>
              </HoverCardTrigger>
              <HoverCardContent
                side="top"
                className="z-50 w-60 text-sm border-muted bg-background/90 backdrop-blur-sm"
              >
                <div className="font-medium mb-1">
                  {info.emoji} {info.label}
                </div>
                <p className="text-muted-foreground text-xs leading-snug">
                  {info.description}
                </p>
              </HoverCardContent>
            </HoverCard>
          );
        })}
      </div>
    </motion.section>
  );
}

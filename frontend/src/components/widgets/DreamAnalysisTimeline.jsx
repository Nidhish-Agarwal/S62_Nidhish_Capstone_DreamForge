import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Lightbulb,
  Brain,
  Bot,
  Palette,
  ScrollText,
  Pencil,
} from "lucide-react";

const steps = [
  {
    title: "Dream Captured",
    icon: <Pencil className="text-purple-400" />,
    description:
      "You describe your dream in your own words — emotions, symbols, and key moments.",
  },
  {
    title: "AI Interpretation",
    icon: <Bot className="text-green-400" />,
    description:
      "Our AI interprets your dream using natural language analysis and psychological models.",
  },
  {
    title: "Mood & Symbol Detection",
    icon: <Lightbulb className="text-yellow-300" />,
    description:
      "Your dream’s mood, symbols, and themes are identified and matched with deeper meanings.",
  },
  {
    title: "Dream Personality Type",
    icon: <Brain className="text-pink-400" />,
    description:
      "Based on patterns, your dream is assigned a unique personality archetype.",
  },
  {
    title: "Dream Image Generation",
    icon: <Palette className="text-sky-400" />,
    description:
      "We generate a custom image that visually captures the feeling and content of your dream.",
  },
  {
    title: "Final Dream Report",
    icon: <ScrollText className="text-white" />,
    description:
      "You receive an immersive, creative dream report combining everything in one experience.",
  },
];

const DreamAnalysisTimeline = () => {
  return (
    <div className="flex flex-col gap-10 mt-10 relative">
      <div className="absolute left-5 top-0 bottom-0 w-1 bg-gradient-to-b from-[#752345] to-[#352736] z-0 rounded-full opacity-40" />

      {steps.map((step, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="relative z-10 flex items-start gap-6"
        >
          <div className="flex flex-col items-center">
            <div className="bg-[#28222B] p-3 rounded-full shadow-lg border border-white/10">
              {step.icon}
            </div>
            {i < steps.length - 1 && (
              <div className="flex-1 w-px bg-white/10 mt-2 mb-2" />
            )}
          </div>

          <Card className="p-5 bg-white/10 border border-white/10 rounded-xl backdrop-blur-md text-white flex-1">
            <h3 className="text-lg font-semibold mb-1">{step.title}</h3>
            <p className="text-sm text-white/80">{step.description}</p>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default DreamAnalysisTimeline;

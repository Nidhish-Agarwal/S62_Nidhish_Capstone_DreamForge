import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { BookOpenCheck } from "lucide-react";

const terms = [
  {
    term: "Dream Vibe",
    definition:
      "The overall emotional tone of your dream — is it peaceful, anxious, surreal, or exciting?",
  },
  {
    term: "Dream Personality Type",
    definition:
      "A profile matched to your subconscious dream behavior. Are you a Seeker? A Shadow Walker?",
  },
  {
    term: "Mythological Archetypes",
    definition:
      "Recurring symbolic characters in dreams — like the Hero, the Shadow, or the Seeker.",
  },
  {
    term: "Sentiment Analysis",
    definition:
      "A breakdown of how much of your dream was positive, negative, or emotionally neutral.",
  },
  {
    term: "Deep Analysis",
    definition:
      "An advanced interpretation that uncovers the emotional journey, themes, and growth messages.",
  },
];

export default function GlossarySection() {
  return (
    <motion.section
      className="mt-12 bg-gradient-to-r from-white/10 via-white/5 to-white/10 p-6 rounded-2xl border border-white/10 backdrop-blur-xl shadow-xl"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <BookOpenCheck className="text-purple-300 w-6 h-6 animate-pulse" />
        <h2 className="text-2xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 text-transparent bg-clip-text">
          Dream Glossary
        </h2>
      </div>

      <Accordion type="single" collapsible className="space-y-3">
        {terms.map((item, idx) => (
          <motion.div
            key={item.term}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
          >
            <AccordionItem
              value={item.term}
              className="rounded-xl overflow-hidden border border-white/10"
            >
              <AccordionTrigger className="text-white text-left px-4 py-3 bg-white/5 hover:bg-white/10 transition-all duration-300 font-semibold tracking-wide">
                {item.term}
              </AccordionTrigger>
              <AccordionContent className="text-white/80 text-sm px-4 py-3 bg-zinc-900/40 backdrop-blur-md rounded-b-xl border-t border-white/10">
                {item.definition}
              </AccordionContent>
            </AccordionItem>
          </motion.div>
        ))}
      </Accordion>
    </motion.section>
  );
}

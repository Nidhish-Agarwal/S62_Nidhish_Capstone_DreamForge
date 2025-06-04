import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const HelpAccordion = ({ filteredSections }) => {
  return filteredSections.map((section, idx) => (
    <motion.div
      key={idx}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.4, delay: idx * 0.1 }}
      className="bg-gradient-to-r from-white/10 via-white/5 to-white/10  p-8 rounded-3xl  border border-white/10 mb-4 "
    >
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
        <h2 className="text-lg font-bold tracking-wide text-white/90">
          {section.category}
        </h2>
      </div>
      <Accordion type="multiple" className="space-y-3">
        {section.questions.map((item, i) => (
          <AccordionItem
            value={`${idx}-${i}`}
            key={i}
            className="border border-white/5 rounded-xl overflow-hidden"
          >
            <AccordionTrigger className="text-base font-semibold text-left px-4 py-3 bg-white/5 hover:bg-white/10 rounded-t-xl transition-colors">
              {item.question}
            </AccordionTrigger>
            <AccordionContent asChild>
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="text-sm text-white/70 px-4 py-3 bg-zinc-900/50 rounded-b-xl backdrop-blur-md"
              >
                {item.answer}
              </motion.div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </motion.div>
  ));
};

export default HelpAccordion;

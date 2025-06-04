import Lottie from "lottie-react";
import dreamyLottie from "../../assets/lotties/dream-bg2.json"; // replace with your chosen Lottie
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function HelpHeroSection() {
  return (
    <section className="relative h-[75vh] flex flex-col justify-center items-center text-center bg-gradient-to-br from-[#3a1c3f] to-[#2c1230] text-white overflow-hidden rounded-3xl shadow-2xl border border-white/10">
      {/* Lottie Background */}
      <Lottie
        animationData={dreamyLottie}
        loop
        autoplay
        className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none"
      />

      {/* Stars / Orbs (floating accents) */}
      <motion.div
        className="absolute top-6 left-12 text-white/40 text-3xl"
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 4 }}
      >
        🌟
      </motion.div>

      <motion.div
        className="absolute bottom-8 right-20 text-white/40 text-2xl"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
      >
        🌙
      </motion.div>

      {/* Content */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-4xl font-bold z-10"
      >
        Need Help Exploring Your Dreams?
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-white/70 max-w-xl mt-4 text-sm z-10"
      >
        Whether you're confused by a symbol, unsure what your dream type means,
        or just want to understand the vibe — we're here to help.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-6 z-10 flex gap-4"
      >
        <Button
          variant="secondary"
          className="text-sm px-5 py-2 "
          onClick={() =>
            document
              .getElementById("faq")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          Browse Help Topics
        </Button>
        <Button
          variant="ghost"
          className="text-sm px-5 py-2 border-white/20"
          onClick={() =>
            document
              .getElementById("support")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          Contact Support
        </Button>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="absolute bottom-5 text-white/50 z-10"
      >
        <ChevronDown className="h-6 w-6" />
      </motion.div>
    </section>
  );
}

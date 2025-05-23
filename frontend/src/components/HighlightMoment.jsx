import { motion } from "framer-motion";
import Lottie from "lottie-react";
// import dreamFloat from "@/assets/lotties/dream-float.json";

const dreamFloat = "";

export default function HighlightMoment({ quote }) {
  if (!quote) return null;

  return (
    <div className="relative w-full mt-6 mb-10">
      {/* Lottie Background */}
      <Lottie
        animationData={dreamFloat}
        loop
        className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none"
      />

      {/* Floating Card */}
      <motion.div
        className="relative z-10 mx-auto max-w-3xl bg-white/10 text-white p-6 rounded-3xl shadow-2xl backdrop-blur-xl border border-white/20"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <blockquote className="text-lg italic font-light leading-relaxed text-center">
          “{quote}”
        </blockquote>
      </motion.div>
    </div>
  );
}

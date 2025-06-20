import { motion } from "framer-motion";

export default function LoadingScreen() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        {/* Main spinner - CSS only animation */}
        <div className="relative w-16 h-16 mb-6">
          {/* Outer ring with gradient */}
          <div
            className="absolute inset-0 rounded-full animate-spin"
            style={{
              background:
                "conic-gradient(from 0deg, transparent, #8b5cf6, transparent)",
              animationDuration: "1s",
            }}
          />

          {/* Inner glow effect */}
          <div className="absolute inset-1 bg-slate-900 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Text with subtle animation */}
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-2">Loading</h2>
          <div className="flex items-center space-x-1 text-gray-400">
            <span>Please wait</span>
            <div className="flex space-x-1">
              <div
                className="w-1 h-1 bg-purple-400 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <div
                className="w-1 h-1 bg-purple-400 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <div
                className="w-1 h-1 bg-purple-400 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          </div>
        </div>

        {/* Optional: Simple progress indication */}
        <div className="mt-6 w-48 h-1 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full animate-pulse"
            style={{
              width: "60%",
              animation: "pulse 2s ease-in-out infinite",
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}

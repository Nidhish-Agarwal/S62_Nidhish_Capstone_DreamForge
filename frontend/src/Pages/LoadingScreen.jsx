import { motion } from "framer-motion";

export default function LoadingScreen() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-semibold">Loading, please wait...</p>
      </motion.div>
    </div>
  );
}

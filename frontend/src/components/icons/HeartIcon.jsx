import React from "react";
import { motion } from "framer-motion";

function HeartIcon({ setLiked, liked }) {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      whileTap={{ scale: 1.2 }}
      initial={{ scale: 1 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 10 }}
      onClick={() => setLiked(!liked)}
      className="cursor-pointer focus:outline-none focus:ring-0"
    >
      <motion.path
        fill={liked ? "#FC607F" : "rgba(0, 0, 0, 0)"}
        stroke="#FC607F"
        strokeWidth="2"
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        initial={{ fill: "rgba(0, 0, 0, 0)", scale: 1 }}
        animate={
          liked
            ? { fill: "#FC607F", scale: 1.1 }
            : { fill: "rgba(0, 0, 0, 0)", scale: 1 }
        }
        transition={{ duration: 0.3 }}
      />
    </motion.svg>
  );
}

export default HeartIcon;

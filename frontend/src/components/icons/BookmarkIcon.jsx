import React from "react";
import { motion } from "framer-motion";

function BookmarkIcon({ setBookmarked, bookmarked }) {
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
      onClick={() => setBookmarked(!bookmarked)}
      className="cursor-pointer focus:outline-none focus:ring-0"
    >
      <motion.path
        fill={bookmarked ? "#FC607F" : "rgba(0, 0, 0, 0)"}
        stroke="#FC607F"
        strokeWidth="2"
        d="M5 3v18l7-5 7 5V3z"
        initial={{ fill: "rgba(0, 0, 0, 0)", scale: 1 }}
        animate={
          bookmarked
            ? { fill: "#FC607F", scale: 1.1 }
            : { fill: "rgba(0, 0, 0, 0)", scale: 1 }
        }
        transition={{ duration: 0.3 }}
      />
    </motion.svg>
  );
}

export default BookmarkIcon;

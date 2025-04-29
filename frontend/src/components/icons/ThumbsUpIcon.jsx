import React, { useState } from "react";
import { motion } from "framer-motion";

function ThumbsUpIcon({ liked }) {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="16"
      height="16"
      whileTap={{ scale: 1.2 }}
      initial={{ scale: 1 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 10 }}
      className="cursor-pointer focus:outline-none focus:ring-0"
    >
      <motion.path
        fill={liked ? "#FC607F" : "rgba(0, 0, 0, 0)"}
        stroke="#FC607F"
        strokeWidth="2"
        d="M7 11L11 2C11.7956 2 12.5587 2.31607 13.1213 2.87868C13.6839 3.44129 14 4.20435 14 5V9H19.66C19.9499 8.99672 20.2371 9.0565 20.5016 9.17522C20.7661 9.29393 21.0016 9.46873 21.1919 9.68751C21.3821 9.90629 21.5225 10.1638 21.6033 10.4423C21.6842 10.7207 21.7035 11.0134 21.66 11.3L20.28 20.3C20.2077 20.7769 19.9654 21.2116 19.5979 21.524C19.2304 21.8364 18.7623 22.0055 18.28 22H7M7 11V22M7 11H4C3.46957 11 2.96086 11.2107 2.58579 11.5858C2.21071 11.9609 2 12.4696 2 13V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H7"
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

export default ThumbsUpIcon;

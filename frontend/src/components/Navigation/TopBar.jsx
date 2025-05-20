import { useEffect, useState } from "react";
import {
  FaSun,
  FaMoon,
  FaSortAmountDownAlt,
  FaFilter,
  FaSearch,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import SearchAndFilterBar from "./SearchAndFilterBar";

export default function TopBar({ currentPath }) {
  const { auth } = useAuth();
  const location = useLocation();
  const showSearchBar =
    location.pathname.startsWith("/mydreams") ||
    location.pathname.startsWith("/community");

  const [darkMode, setDarkMode] = useState(() => {
    return (
      localStorage.getItem("theme") === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const routeTitles = {
    "/dashboard": "Dashboard",
    "/mydreams": "My Dreams",
    "/community": "Community",
    "/gamification": "Gamification",
    "/profile": "Profile",
    "/help": "Help",
  };

  let title = "App"; // Default title

  // Find the longest matching route prefix dynamically
  for (const route in routeTitles) {
    if (currentPath.startsWith(route)) {
      title = routeTitles[route];
      break; // Stop once the first match is found
    }
  }

  return (
    <div className="relative flex flex-wrap md:flex-nowrap  justify-between items-center p-4 px-8 font-Jaldi w-full">
      {/* Left Side - Title */}
      <div className="flex-shrink-0 md:order-0">
        <h1 className="text-3xl font-semibold dark:text-white">{title}</h1>
        <p className="text-gray-500 text-xs">{today}</p>
      </div>

      <SearchAndFilterBar />

      {/* Center Section - Search Bar */}

      {/* Right Side - Theme Toggle & Profile */}
      <div className="flex items-center gap-4 flex-shrink-0 sm:order-2">
        {/* Theme Toggle */}
        <div
          className="flex items-center bg-gray-300 dark:bg-gray-600 w-14 h-8 rounded-full p-1 cursor-pointer transition"
          onClick={() => setDarkMode(!darkMode)}
        >
          <motion.div
            className="w-6 h-6 flex items-center justify-center rounded-full text-white"
            initial={{ x: darkMode ? 24 : 0 }}
            animate={{ x: darkMode ? 24 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{
              backgroundColor: darkMode ? "#374151" : "#FBBF24",
            }}
          >
            {darkMode ? <FaMoon /> : <FaSun />}
          </motion.div>
        </div>

        {/* Profile */}
        {/* <div className="sm:flex hidden items-center gap-2">
          <img
            src="https://randomuser.me/api/portraits/men/1.jpg"
            alt="Profile"
            className="w-12 h-12 rounded-full"
          />
          <span className="font-medium text-xl dark:text-white">
            {auth.userName || "John Smith"}
          </span>
        </div> */}
      </div>
    </div>
  );
}

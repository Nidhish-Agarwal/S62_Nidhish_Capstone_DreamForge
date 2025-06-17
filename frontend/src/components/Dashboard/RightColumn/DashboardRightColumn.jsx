import React, { useEffect, useState } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import RecentDreamsWidget from "./RecentDreamsWidget";
import CommonSymbolsWidget from "./CommonSymbolsWidget";
import MostFrequentDPTWidget from "./MostFrequentDPTWidget";
import AIInsightsWidget from "./AIInsightsWidget";
import { motion } from "framer-motion";
import { toast } from "sonner"; // or your toast lib

const DashboardRightColumn = () => {
  const axiosPrivate = useAxiosPrivate();

  const [loading, setLoading] = useState({
    dreams: true,
    symbols: true,
    dpt: true,
    insights: true,
  });

  const [errors, setErrors] = useState({
    dreams: null,
    symbols: null,
    dpt: null,
    insights: null,
  });

  const [data, setData] = useState({
    recentDreams: [],
    commonSymbols: [],
    mostFrequentDPT: null,
    aiSuggestions: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosPrivate.get("/dream/explore", {
          withCredentials: true,
        });

        setData({
          recentDreams: res.data.recentDreams || [],
          commonSymbols: res.data.commonSymbols || [],
          mostFrequentDPT: res.data.mostFrequentDPT || null,
          aiSuggestions: res.data.aiSuggestions || [],
        });

        setErrors({ dreams: null, symbols: null, dpt: null, insights: null });
      } catch (err) {
        console.error("Failed to load dream data", err);
        toast.error("Failed to fetch dream insights.");

        setErrors({
          dreams: "Could not load dreams",
          symbols: "Could not load symbols",
          dpt: "Could not load personality type",
          insights: "Could not load AI suggestions",
        });
      } finally {
        setLoading({
          dreams: false,
          symbols: false,
          dpt: false,
          insights: false,
        });
      }
    };

    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-md mx-auto space-y-6"
      >
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Dream Explorer
          </h1>
          <p className="text-slate-600 text-sm">
            Dive into your subconscious journey ✨
          </p>
        </motion.div>

        <RecentDreamsWidget
          dreams={data.recentDreams}
          loading={loading.dreams}
          error={errors.dreams}
        />
        <CommonSymbolsWidget
          symbols={data.commonSymbols}
          loading={loading.symbols}
          error={errors.symbols}
        />
        <MostFrequentDPTWidget
          dptData={data.mostFrequentDPT}
          loading={loading.dpt}
          error={errors.dpt}
        />
        <AIInsightsWidget
          suggestions={data.aiSuggestions}
          loading={loading.insights}
          error={errors.insights}
        />
      </motion.div>
    </div>
  );
};

export default DashboardRightColumn;

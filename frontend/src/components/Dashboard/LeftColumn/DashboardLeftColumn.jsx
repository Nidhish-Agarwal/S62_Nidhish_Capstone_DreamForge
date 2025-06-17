import { useState, useEffect } from "react";
import SentimentDoughnut from "./SentimentDoughnut";
import MoodLineChart from "./MoodLineChart";
import DreamCalendarHeatmap from "./DreamCalendarHeatmap";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import DreamLogSummary from "./DreamLogSummary";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { toast } from "sonner";

export default function DashboardLeftColumn() {
  const axiosPrivate = useAxiosPrivate();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axiosPrivate.get("/dream/insights", {
          withCredentials: true,
        });
        setSummary(res.data);
      } catch (err) {
        console.error("Failed to load dream summary", err);
        toast.error("Failed to fetch insights.");
        setHasError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);
  return (
    <ScrollArea className="pr-4">
      <div className="flex flex-col gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <DreamLogSummary
            loading={loading}
            summary={summary}
            hasError={hasError}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <SentimentDoughnut
            loading={loading}
            summary={summary}
            hasError={hasError}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <MoodLineChart
            loading={loading}
            summary={summary}
            hasError={hasError}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
        >
          <DreamCalendarHeatmap
            summary={summary}
            loading={loading}
            hasError={hasError}
          />
        </motion.div>
      </div>
    </ScrollArea>
  );
}

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { toast } from "sonner";

// Components
import DreamLogSummary from "./LeftColumn/DreamLogSummary";
import SentimentDoughnut from "./LeftColumn/SentimentDoughnut";
import MoodLineChart from "./LeftColumn/MoodLineChart";
import DreamCalendarHeatmap from "./LeftColumn/DreamCalendarHeatmap";
import RecentDreamsWidget from "./RightColumn/RecentDreamsWidget";
import CommonSymbolsWidget from "./RightColumn/CommonSymbolsWidget";
import MostFrequentDPTWidget from "./RightColumn/MostFrequentDPTWidget";
import AIInsightsWidget from "./RightColumn/AIInsightsWidget";

export default function DashboardTabs() {
  const axiosPrivate = useAxiosPrivate();

  // API #1: /dream/insights
  const [insightsLoading, setInsightsLoading] = useState(true);
  const [insightsError, setInsightsError] = useState(false);
  const [insightsData, setInsightsData] = useState({
    totalDreams: 0,
    averageMood: "Neutral",
    totalDreamsThisMonth: 0,
    topSymbol: "",
    commonTheme: "",
    sentimentBreakdown: [],
    moodHistory: [],
    calendarData: [],
  });

  // API #2: /dream/explore
  const [exploreLoading, setExploreLoading] = useState(true);
  const [exploreError, setExploreError] = useState({});
  const [exploreData, setExploreData] = useState({
    recentDreams: [],
    commonSymbols: [],
    mostFrequentDPT: null,
    aiSuggestions: [],
  });

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await axiosPrivate.get("/dream/insights", {
          withCredentials: true,
        });
        setInsightsData(res.data);
      } catch (err) {
        console.error("Failed to fetch insights", err);
        toast.error("Failed to fetch dream insights.");
        setInsightsError(true);
      } finally {
        setInsightsLoading(false);
      }
    };

    const fetchExplore = async () => {
      try {
        const res = await axiosPrivate.get("/dream/explore", {
          withCredentials: true,
        });
        setExploreData({
          recentDreams: res.data.recentDreams || [],
          commonSymbols: res.data.commonSymbols || [],
          mostFrequentDPT: res.data.mostFrequentDPT || null,
          aiSuggestions: res.data.aiSuggestions || [],
        });
        setExploreError({});
      } catch (err) {
        console.error("Failed to fetch explore data", err);
        toast.error("Failed to fetch dream exploration data.");
        setExploreError({
          recentDreams: true,
          commonSymbols: true,
          mostFrequentDPT: true,
          aiSuggestions: true,
        });
      } finally {
        setExploreLoading(false);
      }
    };

    fetchInsights();
    fetchExplore();
  }, []);

  return (
    <Tabs defaultValue="insights" className="w-full px-4 py-6">
      <TabsList className="grid grid-cols-4 w-full mb-6">
        <TabsTrigger value="insights">🔮 Insights</TabsTrigger>
        <TabsTrigger value="trends">📈 Trends</TabsTrigger>
        <TabsTrigger value="explorer">💤 Explorer</TabsTrigger>
        <TabsTrigger value="ai">🧠 AI Notes</TabsTrigger>
      </TabsList>

      <TabsContent value="insights">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <DreamLogSummary
            loading={insightsLoading}
            summary={insightsData}
            hasError={insightsError}
          />
          <SentimentDoughnut
            loading={insightsLoading}
            summary={insightsData}
            hasError={insightsError}
          />
        </motion.div>
      </TabsContent>

      <TabsContent value="trends">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <MoodLineChart
            loading={insightsLoading}
            summary={insightsData}
            hasError={insightsError}
          />
          <DreamCalendarHeatmap
            loading={insightsLoading}
            summary={insightsData}
            hasError={insightsError}
          />
        </motion.div>
      </TabsContent>

      <TabsContent value="explorer">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <RecentDreamsWidget
            dreams={exploreData.recentDreams}
            loading={exploreLoading}
            error={exploreError.recentDreams}
          />

          <Tabs defaultValue="symbols" className="mt-4">
            <TabsList>
              <TabsTrigger value="symbols">🔣 Symbols</TabsTrigger>
              <TabsTrigger value="dpt">🧬 DPT</TabsTrigger>
            </TabsList>
            <TabsContent value="symbols">
              <CommonSymbolsWidget
                symbols={exploreData.commonSymbols}
                loading={exploreLoading}
                error={exploreError.commonSymbols}
              />
            </TabsContent>
            <TabsContent value="dpt">
              <MostFrequentDPTWidget
                dptData={exploreData.mostFrequentDPT}
                loading={exploreLoading}
                error={exploreError.mostFrequentDPT}
              />
            </TabsContent>
          </Tabs>
        </motion.div>
      </TabsContent>

      <TabsContent value="ai">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <AIInsightsWidget
            suggestions={exploreData.aiSuggestions}
            loading={exploreLoading}
            error={exploreError.aiSuggestions}
          />
        </motion.div>
      </TabsContent>
    </Tabs>
  );
}

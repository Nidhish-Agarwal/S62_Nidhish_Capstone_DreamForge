import { Flame, LoaderCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

export default function DailyStreakCard({
  streak,
  loading,
  hasError,
  hasLoggedToday,
}) {
  return (
    <Card className="flex items-center justify-between px-5 py-4 bg-orange-100 dark:bg-orange-900/30 border-none shadow-md">
      <div>
        <p className="text-xs text-muted-foreground">🔥 Current Streak</p>

        {loading ? (
          <div className=" h-full">
            <LoaderCircle className="animate-spin w-6 h-6  text-orange-500" />
          </div>
        ) : hasError || streak === null ? (
          <p className="text-sm text-black dark:text-white/80 mt-3">
            Not enough data to calculate Streak.
          </p>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-orange-500">
              {streak} days
            </h2>
            {!hasLoggedToday && streak !== 0 && (
              <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                🔔 Don’t forget to log your dream today to continue the streak!
              </p>
            )}
          </>
        )}
      </div>
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <Flame className="text-orange-500 w-8 h-8" />
      </motion.div>
    </Card>
  );
}

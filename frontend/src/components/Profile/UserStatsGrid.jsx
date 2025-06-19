import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Calendar,
  Heart,
  Bookmark,
  Sparkles,
  Flame,
  Moon,
  Trophy,
  Target,
} from "lucide-react";
import { motion } from "framer-motion";

const UserStatsGrid = ({ user, currentStreak }) => {
  const stats = [
    {
      title: "Dreams Created",
      value: user?.dreamCount || 0,
      icon: Moon,
      color: "from-purple-400 to-purple-600",
      tooltip: "Total dreams you've logged",
    },
    {
      title: "Current Streak",
      value: currentStreak || 0,
      icon: Flame,
      color: "from-orange-400 to-red-500",
      tooltip: "Days in a row you've logged dreams",
      isStreak: true,
    },
    {
      title: "Best Streak",
      value: user?.maxDreamStreak || 0,
      icon: Trophy,
      color: "from-yellow-400 to-orange-500",
      tooltip: "Your longest dream logging streak",
      isMaxStreak: true,
    },
    {
      title: "Posts Liked",
      value: user?.likedPosts?.length || 0,
      icon: Heart,
      color: "from-pink-400 to-red-500",
      tooltip: "Community posts you've liked",
    },
    {
      title: "Bookmarks",
      value: user?.bookmarks?.length || 0,
      icon: Bookmark,
      color: "from-blue-400 to-blue-600",
      tooltip: "Posts you've bookmarked",
    },
  ];

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Unknown";

  const getStreakDisplay = (stat) => {
    if (stat.isStreak && currentStreak > 0) {
      return (
        <div className="flex items-center justify-center gap-1">
          <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
          {currentStreak >= 7 && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🔥
            </motion.div>
          )}
        </div>
      );
    }

    if (stat.isMaxStreak && user?.maxDreamStreak > 0) {
      return (
        <div className="flex items-center justify-center gap-1">
          <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
          {user.maxDreamStreak >= 30 && (
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              👑
            </motion.div>
          )}
        </div>
      );
    }

    return <div className="text-2xl font-bold text-gray-800">{stat.value}</div>;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Your Dream Journey Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
            {stats.map((stat, index) => (
              <TooltipProvider key={stat.title}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Card className="text-center hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden">
                        <CardContent className="p-4">
                          <div
                            className={`inline-flex p-3 rounded-full bg-gradient-to-r ${stat.color} mb-2 shadow-lg`}
                          >
                            <stat.icon className="w-6 h-6 text-white" />
                          </div>
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1 * index, type: "spring" }}
                          >
                            {getStreakDisplay(stat)}
                          </motion.div>
                          <p className="text-sm text-gray-600 font-medium">
                            {stat.title}
                          </p>

                          {/* Special indicators */}
                          {stat.isStreak && currentStreak > 0 && (
                            <div className="absolute top-2 right-2">
                              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                            </div>
                          )}

                          {stat.isMaxStreak && user?.maxDreamStreak >= 10 && (
                            <div className="absolute top-2 right-2">
                              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{stat.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>

          {/* Achievement badges */}
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {currentStreak >= 7 && (
              <Badge
                variant="secondary"
                className="bg-orange-100 text-orange-800"
              >
                <Flame className="w-3 h-3 mr-1" />
                On Fire! 🔥
              </Badge>
            )}
            {user?.maxDreamStreak >= 30 && (
              <Badge
                variant="secondary"
                className="bg-yellow-100 text-yellow-800"
              >
                <Trophy className="w-3 h-3 mr-1" />
                Dream Master 👑
              </Badge>
            )}
            {user?.dreamCount >= 100 && (
              <Badge
                variant="secondary"
                className="bg-purple-100 text-purple-800"
              >
                <Target className="w-3 h-3 mr-1" />
                Century Club 💯
              </Badge>
            )}
          </div>

          <div className="text-center">
            <Badge variant="outline" className="text-sm">
              <Calendar className="w-4 h-4 mr-2" />
              Member since {memberSince}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UserStatsGrid;

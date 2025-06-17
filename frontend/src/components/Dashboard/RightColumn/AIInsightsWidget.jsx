import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye, Loader2, CloudRain } from "lucide-react";

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

const AIInsightsWidget = ({
  suggestions = [],
  loading = false,
  error = null,
}) => {
  return (
    <motion.div variants={itemVariants}>
      <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-xl">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-700">
            <Eye className="w-5 h-5 text-cyan-500" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
                <span className="ml-2 text-slate-500">Loading insights...</span>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">
                <CloudRain className="w-12 h-12 mx-auto mb-2" />
                <p className="font-medium">Error loading insights</p>
                <p className="text-sm text-slate-500 mt-1">{error}</p>
              </div>
            ) : suggestions.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <Eye className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No AI insights available yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {suggestions.map((suggestion, index) => (
                  <motion.div
                    key={suggestion.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.15 }}
                    whileHover={{ x: 4 }}
                    className="group"
                  >
                    <Card className="border border-slate-200 hover:border-cyan-300 transition-all duration-300 hover:shadow-md bg-gradient-to-r from-slate-50 to-cyan-50/30">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <motion.div
                            className="text-xl flex-shrink-0"
                            animate={{
                              rotate: [0, 10, -10, 0],
                            }}
                            transition={{
                              repeat: Infinity,
                              duration: 3,
                              ease: "easeInOut",
                            }}
                          >
                            {suggestion.icon || "🤖"}
                          </motion.div>
                          <div className="flex-1">
                            <Badge className="text-xs mb-2 bg-cyan-100 text-cyan-700 border-cyan-200">
                              {suggestion.category || "Insight"}
                            </Badge>
                            <p className="text-sm text-slate-700 group-hover:text-slate-900 transition-colors">
                              {suggestion.content || "No content available"}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AIInsightsWidget;

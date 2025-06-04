import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useState } from "react";
import { Heart, Bug, Lightbulb } from "lucide-react";

export default function FeedbackSection() {
  const [feedbackType, setFeedbackType] = useState("bug");
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (!message.trim()) {
      toast.error("Please enter some feedback.");
      return;
    }

    toast.success("✨ Thank you for your feedback!");
    setMessage("");
  };

  const feedbackEmojis = {
    bug: "🐞",
    idea: "💡",
    love: "💖",
  };

  const feedbackTitles = {
    bug: "Found a bug?",
    idea: "Got a bright idea?",
    love: "Send some love!",
  };

  return (
    <motion.section
      className="mt-12 bg-gradient-to-r from-white/10 via-white/5 to-white/10   p-6 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-xl"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Tabs
        defaultValue="bug"
        onValueChange={setFeedbackType}
        className="w-full"
      >
        <TabsList className="flex justify-center gap-2 bg-white/5 border border-white/10 p-1 rounded-full mb-4">
          <TabsTrigger
            value="bug"
            className="flex items-center gap-1 text-white/90 data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400 px-4 py-2 rounded-full"
          >
            <Bug className="w-4 h-4" />
            Bug
          </TabsTrigger>
          <TabsTrigger
            value="idea"
            className="flex items-center gap-1 text-white/90 data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400 px-4 py-2 rounded-full"
          >
            <Lightbulb className="w-4 h-4" />
            Idea
          </TabsTrigger>
          <TabsTrigger
            value="love"
            className="flex items-center gap-1 text-white/90 data-[state=active]:bg-pink-500/20 data-[state=active]:text-pink-400 px-4 py-2 rounded-full"
          >
            <Heart className="w-4 h-4" />
            Love
          </TabsTrigger>
        </TabsList>

        <TabsContent value={feedbackType} className="space-y-4">
          <motion.h3
            key={feedbackType}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-xl font-semibold text-white/90 flex items-center gap-2"
          >
            <span className="text-2xl">{feedbackEmojis[feedbackType]}</span>
            {feedbackTitles[feedbackType]}
          </motion.h3>

          <Textarea
            placeholder={`Tell us about the ${
              feedbackType === "bug"
                ? "bug you found"
                : feedbackType === "idea"
                ? "idea you had"
                : "love you have ❤️"
            }...`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="bg-white/10 text-white placeholder-white/40 border border-white/10 min-h-[120px]"
          />

          <Button
            onClick={handleSubmit}
            className="bg-[#29254a] text-white hover:scale-105 transition-transform"
          >
            Submit Feedback
          </Button>
        </TabsContent>
      </Tabs>
    </motion.section>
  );
}

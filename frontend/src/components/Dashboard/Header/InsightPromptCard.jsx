import { Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function InsightPromptCard({
  prompt = "What does 🕳️ mean to you?",
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className="cursor-pointer flex items-center justify-between px-5 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg">
            <div>
              <p className="text-xs">Symbol Prompt</p>
              <p className="text-sm font-semibold truncate">{prompt}</p>
            </div>
            <Sparkles className="w-6 h-6 text-white" />
          </Card>
        </TooltipTrigger>
        <TooltipContent className="text-xs bg-zinc-800 text-white border-none">
          Click to explore or reflect on the symbol
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

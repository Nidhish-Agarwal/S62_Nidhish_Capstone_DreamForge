import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { toast } from "sonner";
import Lottie from "lottie-react";
import { CalendarIcon, Info } from "lucide-react";
import { cn } from "@/lib/utils";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import useAxiosPrivate from "../hooks/useAxiosPrivate";
import dreamyBg from "../assets/lotties/dream-bg.json";
import PreviewPanel from "./overlays/PreviewPanel";
import SymbolThemeCharacterSettingFields from "./SymbolThemeCharaterSettingFields";

const moodOptions = [
  { emoji: "😭", label: "Terrified" },
  { emoji: "😔", label: "Sad" },
  { emoji: "😐", label: "Neutral" },
  { emoji: "😊", label: "Happy" },
  { emoji: "🤩", label: "Euphoric" },
];
const moodLabels = moodOptions.map((m) => m.label);

const schema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  date: z.string().min(1),
  mood: z.enum(moodLabels),
  intensity: z.number().min(0).max(100),
  symbols: z.array(z.string()).optional(),
  themes: z.array(z.string()).optional(),
  characters: z.array(z.string()).optional(),
  setting: z.array(z.string()).optional(),
  notes_to_ai: z.string().optional(),
  real_life_link: z.string().optional(),
});

export default function DreamForm2({ onClose }) {
  const [loading, setLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const today = new Date().toISOString().split("T")[0];
  const [showPreview, setShowPreview] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      mood: "Neutral",
      intensity: 50,
      symbols: [],
      themes: [],
      characters: [],
      setting: [],
      date: today,
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axiosPrivate.post("/dream", data, {
        withCredentials: true,
      });
      if (response.status === 201) {
        toast.success("🎉 Dream added successfully!", {
          description: "You can now view it in your dashboard.",
          duration: 4000, // Auto-close after 4s
          dismissible: true, // Allows user to close manually
        });
        onClose();
      }
    } catch (err) {
      console.log("error message", err);
      if (!err?.response) {
        toast.error("❌ Failed to add dream!", {
          description: "Check your internet connection and try again.",
          duration: 6000, // Auto-close after 6s
          dismissible: true,
        });
        // setErrorMessage("No server response. Please check your internet.");
      } else if (err.response?.status === 401) {
        // setErrorMessage("Session expired. Please log in again.");
        navigate("/login"); // Redirect user if refresh token is invalid
      } else {
        toast.warning("⚠️ Something went wrong", {
          description: "Please try again.",
          duration: 5000, // Auto-close after 5s
          dismissible: true,
        });
        // setErrorMessage("Failed to save dream. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const ToolTipHelper = ({ content }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="ml-1 h-4 w-4 text-muted-foreground cursor-pointer" />
        </TooltipTrigger>
        <TooltipContent className="max-w-xs text-sm">{content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 border border-zinc-700"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-zinc-400 hover:text-white"
          >
            <IoClose size={24} />
          </button>

          <Lottie
            animationData={dreamyBg}
            loop
            autoplay
            className="absolute top-0 left-0 w-full h-32 opacity-20 pointer-events-none"
          />

          <h2 className="text-3xl font-bold text-center mb-4">
            🌙 Describe Your Dream
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="transition-transform duration-300 ease-in-out hover:scale-[1.02]">
              <Label>Title</Label>

              <Input {...register("title")} placeholder="The Dream of Light" />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              )}
            </div>
            <div className="transition-transform duration-300 ease-in-out hover:scale-[1.02]">
              <Label>Description</Label>
              <Textarea
                {...register("description")}
                placeholder="Describe everything you remember..."
                rows={4}
              />
              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                control={control}
                name="date"
                render={({ field }) => (
                  <div className="flex flex-col gap-2">
                    <Label>Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value
                            ? format(new Date(field.value), "PPP")
                            : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) =>
                            field.onChange(date.toISOString())
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.date && (
                      <p className="text-red-500 text-sm">
                        {errors.date.message}
                      </p>
                    )}
                  </div>
                )}
              />

              <div className="transition-transform duration-300 ease-in-out hover:scale-[1.02]">
                <Label className="flex items-center gap-2">
                  Mood
                  <span className="text-2xl animate-pulse">
                    {
                      moodOptions.find((m) => m.label === watch("mood"))
                        ?.emoji ?? moodOptions[2].emoji // fallback to Neutral
                    }
                  </span>
                </Label>

                <Controller
                  control={control}
                  name="mood"
                  render={({ field }) => (
                    <div className="flex items-center gap-2 mt-2">
                      {moodOptions.map((mood) => (
                        <TooltipProvider key={mood.label}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                variant={
                                  field.value === mood.label
                                    ? "default"
                                    : "outline"
                                }
                                onClick={() => field.onChange(mood.label)}
                                className="text-xl transition-transform duration-150"
                              >
                                {mood.emoji}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>{`${mood.emoji} (${mood.label})`}</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                    </div>
                  )}
                />
              </div>

              <div>
                <Label>Intensity</Label>
                <Controller
                  control={control}
                  name="intensity"
                  render={({ field }) => (
                    <Slider
                      value={[field.value]}
                      onValueChange={(v) => field.onChange(v[0])}
                      max={100}
                      step={1}
                    />
                  )}
                />
              </div>
            </div>
            <SymbolThemeCharacterSettingFields
              watch={watch}
              setValue={setValue}
              register={register}
              ToolTipHelper={ToolTipHelper}
            />

            <div className="transition-transform duration-300 ease-in-out hover:scale-[1.02]">
              <Label className="flex items-center gap-1">
                Notes to AI (optional)
                <ToolTipHelper
                  content="Add anything you'd like the AI to consider while analyzing
                      the dream — emotions, thoughts before sleep, symbols, etc."
                />
              </Label>
              <Textarea
                {...register("notes_to_ai")}
                placeholder="Anything extra you want the AI to consider?"
                rows={2}
              />
            </div>
            <div className="transition-transform duration-300 ease-in-out hover:scale-[1.02]">
              <Label className="flex items-center gap-1">
                Real-life Link (optional)
                <ToolTipHelper
                  content="If something from your day or real life triggered this
                      dream, mention it here for deeper insight."
                />
              </Label>
              <Textarea
                {...register("real_life_link")}
                placeholder="Did anything from real life influence this dream?"
                rows={2}
              />
            </div>
            <Button
              type="button"
              className="transition-transform duration-300 ease-in-out hover:scale-[1.02]"
              onClick={() => setShowPreview(true)}
            >
              Preview
            </Button>
            <PreviewPanel
              show={showPreview}
              onClose={() => setShowPreview(false)}
              values={{
                title: watch("title"),
                description: watch("description"),
                date: watch("date"),
                mood: watch("mood"),
                intensity: watch("intensity"),
                symbols: watch("symbols"),
                themes: watch("themes"),
                characters: watch("characters"),
                setting: watch("setting"),
                notes_to_ai: watch("notes_to_ai"),
                real_life_link: watch("real_life_link"),
              }}
            />
            <Button
              type="submit"
              className="w-full mt-6 transition-transform duration-300 ease-in-out hover:scale-[1.02]"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Dream ✨"}
            </Button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

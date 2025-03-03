import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const emotionsList = ["Happy", "Sad", "Fearful", "Excited", "Confused"];
const dreamTypeList = [
  "Lucid",
  "Nightmare",
  "Recurring",
  "Fantasy",
  "Prophetic",
];

const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  emotions: z.array(z.string()).nonempty("Select at least one emotion"),
  dreamType: z.string().min(1, "Select a dream type"),
  date: z.string().min(1, "Select a valid date"),
});

const DreamForm = ({ onClose }) => {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { emotions: [], date: today },
  });

  const selectedEmotions = watch("emotions");

  const toggleEmotion = (emotion) => {
    setValue(
      "emotions",
      selectedEmotions.includes(emotion)
        ? selectedEmotions.filter((e) => e !== emotion)
        : [...selectedEmotions, emotion]
    );
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMessage("");
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
        setErrorMessage("No server response. Please check your internet.");
      } else if (err.response?.status === 401) {
        setErrorMessage("Session expired. Please log in again.");
        navigate("/login"); // Redirect user if refresh token is invalid
      } else {
        toast.warning("⚠️ Something went wrong", {
          description: "Please try again.",
          duration: 5000, // Auto-close after 5s
          dismissible: true,
        });
        setErrorMessage("Failed to save dream. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-gradient-to-br from-[#752345] to-[#352736] p-8 rounded-3xl shadow-xl border border-gray-700 max-w-xl w-full mx-4 max-h-[90%] overflow-auto relative"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition"
          >
            <IoClose size={24} />
          </button>
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Add Your Dream
          </h2>
          {errorMessage && (
            <p className="text-red-400 text-center">{errorMessage}</p>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="text-gray-200 block mb-1">Dream Title:</label>
              <Input
                {...register("title")}
                className="bg-white/25 text-white border-none rounded-xl placeholder:text-[#B2B2B2]"
                placeholder="Enter title of your dream"
              />
              {errors.title && (
                <p className="text-red-400">{errors.title.message}</p>
              )}
            </div>
            <div>
              <label className="text-gray-200 block mb-1">
                Dream Description:
              </label>
              <Textarea
                {...register("description")}
                className="bg-white/25 text-white border-none rounded-xl placeholder:text-[#B2B2B2]"
                placeholder="Describe your dream in detail"
              />
              {errors.description && (
                <p className="text-red-400">{errors.description.message}</p>
              )}
            </div>
            <div>
              <label className="text-gray-300 block mb-1">Emotions Felt:</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {emotionsList.map((emotion) => (
                  <button
                    type="button"
                    key={emotion}
                    className={`px-3 py-1 rounded-full border transition ${
                      selectedEmotions.includes(emotion)
                        ? "bg-white/50 text-white border-white/0"
                        : "bg-transparent text-gray-300 border-gray-500 hover:bg-white/20"
                    }`}
                    onClick={() => toggleEmotion(emotion)}
                  >
                    {emotion}
                  </button>
                ))}
              </div>
              {errors.emotions && (
                <p className="text-red-400">{errors.emotions.message}</p>
              )}
            </div>
            <div>
              <label className="text-gray-200 block mb-1">Dream Type:</label>
              <Select onValueChange={(value) => setValue("dreamType", value)}>
                <SelectTrigger className="bg-white/25 text-white border-none rounded-xl">
                  <SelectValue placeholder="Select dream type" />
                </SelectTrigger>
                <SelectContent>
                  {dreamTypeList.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.dreamType && (
                <p className="text-red-400">{errors.dreamType.message}</p>
              )}
            </div>
            <div>
              <label className="text-gray-200 block mb-1">Dream Date:</label>
              <Input
                type="date"
                {...register("date")}
                className="bg-white/25 text-white border-none rounded-xl"
              />
              {errors.date && (
                <p className="text-red-400">{errors.date.message}</p>
              )}
            </div>
            <div className="flex justify-between mt-6">
              <Button
                type="button"
                className="text-gray-300 hover:text-white"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-red-500 text-white px-6 py-2 rounded-xl hover:bg-red-400 transition"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Dream"}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DreamForm;

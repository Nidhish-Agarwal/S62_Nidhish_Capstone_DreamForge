import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const ReplyInput = ({ placeholder, onSubmit, onCancel }) => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  // Handle Esc key to cancel reply (optional feature)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && onCancel) {
        onCancel(); // Close the reply input
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (text.trim() === "") return;

    try {
      setLoading(true);
      await onSubmit(text.trim()); // Assume parent handles adding new reply instantly
      // toast.success("Reply posted!");
      setText("");
      if (onCancel) onCancel(); // Optional: Close input after posting
    } catch (error) {
      console.error("Error posting reply:", error);
      toast.error(error?.response?.data?.message || "Failed to post reply.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-2 mt-2"
    >
      <Input
        ref={inputRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        disabled={loading}
        className=" ml-7 text-sm  rounded-full focus-visible:ring-1 focus-visible:ring-pink-500"
      />
      <Button
        type="submit"
        size="sm"
        className="text-xs px-4 py-2 rounded-full"
        disabled={loading || text.trim() === ""}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Reply"}
      </Button>
    </motion.form>
  );
};

export default ReplyInput;

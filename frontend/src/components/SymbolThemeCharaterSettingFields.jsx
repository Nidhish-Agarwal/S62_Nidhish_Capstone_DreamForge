import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

const symbolOptions = [
  { emoji: "🔥", label: "Fire" },
  { emoji: "⏳", label: "Time" },
  { emoji: "🕳️", label: "Trap" },
  { emoji: "🦋", label: "Transformation" },
];

const themeOptions = ["Flying", "Falling", "Chase", "Magic"];
const defaultCharacters = [
  "👩 Friend",
  "👨‍🚀 Astronaut",
  "🧙 Wizard",
  "🧛 Vampire",
];
const defaultSettings = ["🏠 Home", "🏞️ Forest", "🏖️ Beach", "🪐 Space"];

export default function SymbolThemeCharacterSettingFields({
  watch,
  setValue,
  register,
  ToolTipHelper,
}) {
  const handleAddItem = (key, value) => {
    const current = watch(key) || [];
    setValue(key, [...current, value]);
  };

  const handleRemoveItem = (key, idx) => {
    const current = watch(key) || [];
    setValue(
      key,
      current.filter((_, i) => i !== idx)
    );
  };

  const renderAnimatedChip = (text, key, idx) => (
    <motion.div
      key={idx}
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
    >
      <Badge
        variant="secondary"
        className="flex items-center gap-1 bg-gradient-to-r from-purple-400 to-pink-500 text-white px-3 py-1 rounded-full shadow-md hover:shadow-xl transition-all"
      >
        {text}
        <button
          type="button"
          onClick={() => handleRemoveItem(key, idx)}
          className="ml-1 text-white hover:text-red-400"
        >
          ×
        </button>
      </Badge>
    </motion.div>
  );

  return (
    <>
      {/* Symbols */}
      <div className="transition-transform duration-300 ease-in-out hover:scale-[1.02]">
        <Label className="flex items-center gap-1">
          Symbols (Emoji + Meaning)
          <ToolTipHelper content="Symbols are objects, animals, or events in your dream that may carry deeper meanings — like fire, clocks, or tunnels." />
        </Label>
        <Input
          placeholder="Type to add..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              const value = e.target.value.trim();
              if (value) {
                handleAddItem("symbols", value);
                e.target.value = "";
              }
            }
          }}
        />
        <div className="flex flex-wrap gap-2">
          {symbolOptions.map((sym) => (
            <Button
              key={sym.label}
              type="button"
              variant="outline"
              onClick={() =>
                handleAddItem("symbols", `${sym.emoji} ${sym.label}`)
              }
              className="hover:shadow-glow border-dashed"
            >
              {sym.emoji} {sym.label}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          <AnimatePresence>
            {watch("symbols")?.map((s, idx) =>
              renderAnimatedChip(s, "symbols", idx)
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Themes */}
      <div className="transition-transform duration-300 ease-in-out hover:scale-[1.02]">
        <Label className="flex items-center gap-1">
          Themes
          <ToolTipHelper content="Themes are patterns or common dream scenarios — like flying, being chased, or losing control — that shape the story of your dream." />
        </Label>
        <Input
          placeholder="Type to add..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              const value = e.target.value.trim();
              if (value) {
                handleAddItem("themes", value);
                e.target.value = "";
              }
            }
          }}
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {themeOptions.map((theme) => (
            <Button
              key={theme}
              variant="outline"
              type="button"
              onClick={() => handleAddItem("themes", theme)}
              className="hover:shadow-glow"
            >
              {theme}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          <AnimatePresence>
            {watch("themes")?.map((theme, idx) =>
              renderAnimatedChip(theme, "themes", idx)
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Characters */}
      <div className="transition-transform duration-300 ease-in-out hover:scale-[1.02]">
        <Label className="flex items-center gap-1">
          Characters
          <ToolTipHelper content="Characters are people, animals, or figures who appeared in your dream — they could be friends, strangers, or even fictional beings." />
        </Label>
        <Input
          placeholder="Add characters..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              const value = e.target.value.trim();
              if (value) {
                handleAddItem("characters", value);
                e.target.value = "";
              }
            }
          }}
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {defaultCharacters.map((char) => (
            <Button
              key={char}
              variant="outline"
              type="button"
              onClick={() => handleAddItem("characters", char)}
              className="hover:shadow-glow"
            >
              {char}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          <AnimatePresence>
            {watch("characters")?.map((char, idx) =>
              renderAnimatedChip(char, "characters", idx)
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Setting */}
      <div className="transition-transform duration-300 ease-in-out hover:scale-[1.02]">
        <Label className="flex items-center gap-1">
          Setting
          <ToolTipHelper content="Settings describe where your dream took place — such as a beach, forest, classroom, or even surreal, imaginary places." />
        </Label>
        <Input
          placeholder="E.g. School, Space, Beach"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              const value = e.target.value.trim();
              if (value) {
                handleAddItem("setting", value);
                e.target.value = "";
              }
            }
          }}
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {defaultSettings.map((place) => (
            <Button
              key={place}
              variant="outline"
              type="button"
              onClick={() => handleAddItem("setting", place)}
              className="hover:shadow-glow"
            >
              {place}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          <AnimatePresence>
            {watch("setting")?.map((place, idx) =>
              renderAnimatedChip(place, "setting", idx)
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

import * as React from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";

export function DatePicker({
  mode = "single", // "single" or "range"
  selected,
  onSelect,
  placeholder = "Pick a date",
  className = "",
  dateFormat = "PPP", // e.g., "PPP" = Jan 1, 2025
}) {
  const renderLabel = () => {
    if (!selected) return placeholder;

    if (mode === "range") {
      if (selected?.from && selected?.to) {
        return `${format(selected.from, dateFormat)} → ${format(
          selected.to,
          dateFormat
        )}`;
      }
      return selected?.from ? format(selected.from, dateFormat) : placeholder;
    }

    return selected ? format(selected, dateFormat) : placeholder;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-[280px] justify-start text-left font-normal ${
            !selected ? "text-muted-foreground" : ""
          } ${className}`}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {renderLabel()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode={mode}
          selected={selected}
          onSelect={onSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

// components/shared/SearchAndFilterBar.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ChevronDown, ChevronsUpDown, ChevronUp, Filter } from "lucide-react";
import { useSearchContext } from "../../context/SearchContext";
import SortIcon from "../icons/Sort_Icon";
import { DatePicker } from "@/components/ui/DatePicker";

const myDreamsConfig = {
  sortOptions: [
    { label: "Newest First", value: "newest" },
    { label: "Oldest First", value: "oldest" },
    { label: "Liked First", value: "liked" },
  ],
  filters: {
    status: {
      label: "Status",
      type: "multi-select",
      options: [
        { label: "Pending", value: "pending" },
        { label: "Processing", value: "processing" },
        { label: "Completed", value: "completed" },
        { label: "Failed", value: "failed" },
      ],
    },
    mood: {
      label: "Mood",
      type: "multi-select",
      options: [
        { label: "😭 Terrified", value: "Terrified" },
        { label: "😔 Sad", value: "Sad" },
        { label: "😐 Neutral", value: "Neutral" },
        { label: "😊 Happy", value: "Happy" },
        { label: "🤩 Euphoric", value: "Euphoric" },
      ],
    },
    personalityType: {
      label: "Dream Personality Type",
      type: "multi-select",
      options: [
        { label: "The Architect", value: "dpt_architect" },
        { label: "The Echo", value: "dpt_echo" },
        { label: "The Guardian", value: "dpt_guardian" },
        { label: "The Healer", value: "dpt_healer" },
        { label: "The Illusionist", value: "dpt_illusionist" },
        { label: "The Seeker", value: "dpt_seeker" },
        { label: "The Shadow Walker", value: "dpt_shadow_walker" },
        { label: "The Trickster", value: "dpt_trickster" },
        { label: "The Visionary", value: "dpt_visionary" },
        { label: "The Wanderer", value: "dpt_wanderer" },
      ],
    },
    date: {
      label: "Date Range",
      type: "date",
    },
    likedOnly: {
      label: "Liked Only",
      type: "toggle",
    },
  },
};

const communityConfig = {
  sortOptions: [
    { label: "Most Recent", value: "newest" },
    { label: "Oldeset", value: "oldest" },
    { label: "Most Liked", value: "mostLiked" },
    { label: "Most Commented", value: "mostCommented" },
    { label: "Most Bookmarked", value: "mostBookmarked" },
  ],
  filters: {
    mood: {
      label: "Mood",
      type: "multi-select",
      options: [
        { label: "😭 Terrified", value: "Terrified" },
        { label: "😔 Sad", value: "Sad" },
        { label: "😐 Neutral", value: "Neutral" },
        { label: "😊 Happy", value: "Happy" },
        { label: "🤩 Euphoric", value: "Euphoric" },
      ],
    },
    personalityType: {
      label: "Dream Personality Type",
      type: "multi-select",
      options: [
        { label: "The Architect", value: "dpt_architect" },
        { label: "The Echo", value: "dpt_echo" },
        { label: "The Guardian", value: "dpt_guardian" },
        { label: "The Healer", value: "dpt_healer" },
        { label: "The Illusionist", value: "dpt_illusionist" },
        { label: "The Seeker", value: "dpt_seeker" },
        { label: "The Shadow Walker", value: "dpt_shadow_walker" },
        { label: "The Trickster", value: "dpt_trickster" },
        { label: "The Visionary", value: "dpt_visionary" },
        { label: "The Wanderer", value: "dpt_wanderer" },
      ],
    },
    date: {
      label: "Date Range",
      type: "date",
    },
    likedOnly: {
      label: "Liked Posts",
      type: "toggle",
    },
  },
};

const SearchAndFilterBar = () => {
  const location = useLocation();
  const previousPathRef = useRef(location.pathname);
  const { filters, updateFilter, resetFilters } = useSearchContext();
  const [localFilters, setLocalFilters] = useState(filters);
  const [filterPopoverOpen, setFilterPopoverOpen] = useState(false);
  const [sortPopoverOpen, setSortPopoverOpen] = useState(false);
  const [openFilterKey, setOpenFilterKey] = useState(null);

  const config = useMemo(() => {
    if (location.pathname.startsWith("/community")) return communityConfig;
    return myDreamsConfig;
  }, [location.pathname]);

  useEffect(() => {
    if (previousPathRef.current !== location.pathname) {
      resetFilters();
      previousPathRef.current = location.pathname;
    }
    setLocalFilters(filters);
  }, [location.pathname, filters]);

  const toggleMultiSelect = (key, value) => {
    setLocalFilters((prev) => {
      const current = prev[key] || [];
      return {
        ...prev,
        [key]: current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value],
      };
    });
  };

  const toggleBoolean = (key) => {
    setLocalFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const applyAllFilters = () => {
    Object.entries(localFilters).forEach(([key, value]) => {
      updateFilter(key, value);
    });
  };

  const renderFilterSubmenu = (key, config) => {
    if (config.type === "multi-select") {
      return (
        <div className="flex flex-wrap gap-2 px-2 py-1">
          {config.options.map((opt) => (
            <motion.div
              key={opt.value}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Button
                variant={
                  localFilters[key]?.includes(opt.value) ? "default" : "outline"
                }
                size="sm"
                onClick={() => toggleMultiSelect(key, opt.value)}
                className="justify-start text-xs px-3 py-1"
              >
                {opt.label}
              </Button>
            </motion.div>
          ))}
        </div>
      );
    }

    if (config.type === "toggle") {
      return (
        <div className="flex items-center justify-between px-2 py-1">
          <span className="text-sm font-medium">{config.label}</span>
          <Switch
            checked={!!localFilters[key]}
            onCheckedChange={() => toggleBoolean(key)}
          />
        </div>
      );
    }

    if (config.type === "date") {
      return (
        <div className="px-2 py-1">
          <DatePicker
            mode="range"
            selected={localFilters[key] || null}
            onSelect={(date) =>
              setLocalFilters((prev) => ({ ...prev, [key]: date }))
            }
          />
        </div>
      );
    }

    return null;
  };

  return (
    <div className=" flex flex-row items-start sm:items-center justify-between gap-3 p-3 border rounded-2xl bg-background/60 shadow-md backdrop-blur-md order-3 md:order-1">
      {/* Search Input */}
      <div className="relative w-full sm:max-w-xs">
        <Input
          value={localFilters.searchQuery}
          onChange={(e) => {
            const val = e.target.value;
            setLocalFilters((prev) => ({ ...prev, searchQuery: val }));
            updateFilter("searchQuery", val);
          }}
          placeholder="Search your dreams..."
          className="pl-10 pr-4 py-2 rounded-xl border border-muted bg-white/10 backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-200"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          🔍
        </span>
      </div>

      {/* Filter + Sort Buttons */}
      <div className="flex gap-3 items-center w-full sm:w-auto">
        {/* Sort Button */}
        <Popover open={sortPopoverOpen} onOpenChange={setSortPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="rounded-xl px-4 py-2 flex gap-2 items-center hover:bg-muted/40 transition w-full sm:w-auto"
            >
              <SortIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Sort</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-60 p-0 border-none rounded-xl shadow-lg bg-background">
            <Command>
              <CommandList>
                <CommandGroup heading="Sort by">
                  {config.sortOptions.map((opt) => (
                    <CommandItem
                      key={opt.value}
                      onSelect={() => {
                        setLocalFilters((prev) => ({
                          ...prev,
                          sortOption: opt.value,
                        }));
                        updateFilter("sortOption", opt.value);
                        setSortPopoverOpen(false);
                      }}
                      className={`cursor-pointer ${
                        localFilters.sortOption === opt.value
                          ? "bg-muted font-semibold"
                          : ""
                      }`}
                    >
                      {opt.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Filter Button */}
        <Popover open={filterPopoverOpen} onOpenChange={setFilterPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="rounded-xl px-4 py-2 flex gap-2 items-center hover:bg-muted/40 transition w-full sm:w-auto"
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 bg-background/90 backdrop-blur-lg p-4 rounded-xl shadow-lg">
            <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
              {Object.entries(config.filters).map(([key, cfg]) => {
                const isOpen = openFilterKey === key;

                return (
                  <div key={key}>
                    {cfg.type === "toggle" ? (
                      renderFilterSubmenu(key, cfg)
                    ) : (
                      <>
                        <div
                          className="flex justify-between items-center cursor-pointer px-2 py-1 hover:bg-muted/30 rounded-md"
                          onClick={() =>
                            setOpenFilterKey((prev) =>
                              prev === key ? null : key
                            )
                          }
                        >
                          <span className="font-medium text-sm">
                            {cfg.label}
                          </span>
                          <motion.span
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <ChevronDown className="w-4 h-4" />
                          </motion.span>
                        </div>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              key={key}
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="pl-2 mt-1"
                            >
                              {renderFilterSubmenu(key, cfg)}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex justify-between">
              <Button
                variant="ghost"
                className="text-xs"
                onClick={() => {
                  resetFilters();
                  setLocalFilters(filters);

                  setFilterPopoverOpen(false);
                }}
              >
                Clear
              </Button>
              <Button
                className="rounded-xl"
                onClick={() => {
                  applyAllFilters();
                  setFilterPopoverOpen(false);
                }}
              >
                Apply
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default SearchAndFilterBar;

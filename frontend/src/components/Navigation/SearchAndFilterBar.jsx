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
    emotions: {
      label: "Emotions",
      type: "multi-select",
      options: [
        { label: "Joy", value: "joy" },
        { label: "Fear", value: "fear" },
        { label: "Sadness", value: "sadness" },
        { label: "Anger", value: "anger" },
        { label: "Surprise", value: "surprise" },
        { label: "Disgust", value: "disgust" },
      ],
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
    { label: "Most Liked", value: "mostLiked" },
    { label: "Most Commented", value: "mostCommented" },
    { label: "Most Bookmarked", value: "mostBookmarked" },
  ],
  filters: {
    emotions: {
      label: "Emotions in Dream",
      type: "multi-select",
      options: [
        { label: "Joy", value: "joy" },
        { label: "Fear", value: "fear" },
        { label: "Sadness", value: "sadness" },
        { label: "Anger", value: "anger" },
        { label: "Surprise", value: "surprise" },
        { label: "Disgust", value: "disgust" },
      ],
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

  useEffect(() => {
    console.log(localFilters);
  }, [localFilters]);

  const config = useMemo(() => {
    if (location.pathname.startsWith("/community")) return communityConfig;
    return myDreamsConfig;
  }, [location.pathname]);

  const [filterPopoverOpen, setFilterPopoverOpen] = useState(false);
  const [sortPopoverOpen, setSortPopoverOpen] = useState(false);
  const [openFilterKey, setOpenFilterKey] = useState(null);

  useEffect(() => {
    if (previousPathRef.current !== location.pathname) {
      resetFilters();
      previousPathRef.current = location.pathname;
    }
    setLocalFilters(filters); // sync on mount or path change
    console.log("filters", filters);
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
    setLocalFilters((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const applyAllFilters = () => {
    Object.entries(localFilters).forEach(([key, value]) => {
      updateFilter(key, value);
    });
  };

  const renderFilterSubmenu = (key, config) => {
    if (config.type === "multi-select") {
      return (
        <div className="flex flex-col gap-1 px-2 py-1">
          {config.options.map((opt) => (
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                key={opt.value}
                variant={
                  localFilters[key]?.includes(opt.value) ? "default" : "outline"
                }
                size="sm"
                onClick={() => toggleMultiSelect(key, opt.value)}
                className="justify-start"
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
          <span className="text-sm">{config.label}</span>
          <Switch
            checked={!!localFilters[key]}
            onCheckedChange={() => toggleBoolean(key)}
          />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full flex flex-row md:items-center justify-between gap-2 px-2 py-3 border rounded-2xl bg-background/60 shadow-md order-3 sm:order-1 backdrop-blur-md max-w-sm">
      {/* Search Bar */}
      <div className="relative flex items-center w-full md:max-w-sm">
        <Input
          value={localFilters.searchQuery}
          onChange={(e) => {
            setLocalFilters((prev) => ({
              ...prev,
              searchQuery: e.target.value,
            }));
            updateFilter("searchQuery", e.target.value);
          }}
          placeholder="Search your dreams..."
          className="pl-10 pr-4 py-2 rounded-xl border border-muted bg-white/10 backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-200"
        />
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="absolute left-3 text-muted-foreground"
        >
          🔍
        </motion.span>
      </div>

      {/* Sort & Filter Buttons */}
      <div className="flex gap-3 items-center">
        {/* Sort */}
        <Popover open={sortPopoverOpen} onOpenChange={setSortPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="rounded-xl px-4 py-2 flex gap-2 items-center hover:bg-muted/40 transition"
            >
              <SortIcon className="w-4 h-4 text-black dark:text-white" />
              <span className="hidden sm:inline">Sort</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-0 border-none rounded-xl shadow-lg bg-background">
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
                        updateFilter("sortOption", opt.value); // sync immediately
                        setSortPopoverOpen(false); // close dropdown
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

        {/* Filter */}
        <Popover open={filterPopoverOpen} onOpenChange={setFilterPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="rounded-xl px-4 py-2 flex gap-2 items-center hover:bg-muted/40 transition"
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 bg-background/80 backdrop-blur-lg p-4 rounded-xl shadow-lg">
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
                          <span>{cfg.label}</span>
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
                  const clearedFilters = {
                    ...localFilters,
                    likedOnly: false,
                    emotions: [],
                    status: [],
                  };

                  setLocalFilters(clearedFilters);

                  Object.entries(clearedFilters).forEach(([key, val]) => {
                    updateFilter(key, val);
                  });

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

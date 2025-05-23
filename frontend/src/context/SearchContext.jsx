// contexts/SearchContext.jsx
import { createContext, useContext, useState } from "react";

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [filters, setFilters] = useState({
    searchQuery: "",
    sortOption: "newest", // e.g. "newest"
    likedOnly: false,
    mood: [],
    personalityType: [],
    date: {},
    status: [],
  });

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      searchQuery: "",
      sortOption: "newest",
      likedOnly: false,
      mood: [],
      personalityType: [],
      date: {},
      status: [],
    });
  };

  return (
    <SearchContext.Provider value={{ filters, updateFilter, resetFilters }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = () => useContext(SearchContext);

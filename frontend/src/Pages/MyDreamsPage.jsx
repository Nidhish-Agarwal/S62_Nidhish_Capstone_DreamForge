import React, { useState } from "react";
import DreamCard from "../components/Cards/DreamCard";

const demoDreams = [
  {
    id: "1",
    title: "Lost in a Maze",
    date: "5th Feb 2025",
    description:
      "I found myself wandering through an endless maze, unable to find my way out. The walls kept shifting, making it even more confusing.",
    meaning:
      "This dream suggests feelings of uncertainty or being stuck in a situation. It might represent indecisiveness or a search for direction in life.",
    keywords: ["Maze", "Lost", "Confusion"],
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSATHXh1kHWxN7H_dHc2j6vqvaT3_LwQauJ1Q&s",
    sentiment: {
      positive: "30",
      negative: "60",
      neutral: "10",
    },
    isLiked: "false",
  },
  {
    id: "2",
    title: "Talking Animals",
    date: "12th Jan 2025",
    description:
      "I had a dream where animals could talk to me. A wise owl gave me life advice, and a fox shared secrets of the universe.",
    meaning:
      "This dream may symbolize wisdom, hidden knowledge, or a deep connection with nature. It could also mean you are looking for guidance in life.",
    keywords: ["Animals", "Talking", "Wisdom"],
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSATHXh1kHWxN7H_dHc2j6vqvaT3_LwQauJ1Q&s",
    sentiment: {
      positive: "50",
      negative: "20",
      neutral: "30",
    },
    isLiked: "true",
  },
  {
    id: "3",
    title: "Floating in Space",
    date: "20th Jan 2025",
    description:
      "I dreamt that I was floating freely in space, gazing at the stars and feeling weightless. It was peaceful yet overwhelming.",
    meaning:
      "This dream could signify a desire for freedom or exploration. It might also reflect feelings of isolation or detachment from reality.",
    keywords: ["Space", "Floating", "Stars"],
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSATHXh1kHWxN7H_dHc2j6vqvaT3_LwQauJ1Q&s",
    sentiment: {
      positive: "65",
      negative: "25",
      neutral: "10",
    },
    isLiked: "true",
  },
  {
    id: "4",
    title: "Chasing Shadows",
    date: "28th Jan 2025",
    description:
      "I was running after dark figures in a foggy forest, but no matter how fast I went, I couldn't catch them.",
    meaning:
      "This dream might indicate unresolved issues or the pursuit of something unattainable. It could also symbolize fear or uncertainty.",
    keywords: ["Shadows", "Running", "Forest"],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9T2lJm0w",
    sentiment: {
      positive: "40",
      negative: "50",
      neutral: "10",
    },
    isLiked: "false",
  },
];

const FilterSortSearch = ({ onSearch, onSort, onFilter }) => (
  <div className="flex gap-2 items-center">
    <Button onClick={() => onSort("asc")}>⬆️</Button>
    <Button onClick={() => onSort("desc")}>⬇️</Button>
    <Button onClick={() => onFilter("Spooky")}>Spooky</Button>
    <Button onClick={() => onFilter("Fantasy")}>Fantasy</Button>
    <Input
      placeholder="Search..."
      onChange={(e) => onSearch(e.target.value)}
      className="w-48"
    />
  </div>
);

const MyDreamsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState(null);
  const [filterCategory, setFilterCategory] = useState(null);

  const filteredDreams = demoDreams
    .filter((dream) =>
      dream.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((dream) =>
      filterCategory ? dream.category === filterCategory : true
    )
    .sort((a, b) => {
      if (sortOrder === "asc") return new Date(a.date) - new Date(b.date);
      if (sortOrder === "desc") return new Date(b.date) - new Date(a.date);
      return 0;
    });

  return (
    <div className="w-full flex-row flex justify-center">
      {/* <FilterSortSearch
        onSearch={setSearchQuery}
        onSort={setSortOrder}
        onFilter={setFilterCategory}
      /> */}

      <div className="grid grid-cols-1  sm:grid-cols-2 gap-4 z-0">
        {filteredDreams.map((dream) => (
          <DreamCard key={dream.id} dream={dream} />
        ))}
      </div>
    </div>
  );
};

export default MyDreamsPage;

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import DreamCard from "../components/Cards/DreamCard";
import PostCard_DashBoard from "../components/Cards/PostCard_DashBoard";
import DreamForm from "../components/DreamForm";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {
  const demoDreams = [
    {
      id: "1",
      title: "Lost in a Maze",
      date: "2025-03-07T14:30:00.123Z",
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
      date: "2025-03-07T14:30:00.123Z",
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
      date: "2025-03-07T14:30:00.123Z",
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
      date: "2025-03-07T14:30:00.123Z",
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

  const demoPosts = [
    {
      user: {
        name: "John Smith",
        profilePicture:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSATHXh1kHWxN7H_dHc2j6vqvaT3_LwQauJ1Q&s",
      },
      date: "24/01/2025",
      title: "Crazy Ghosts",
      description:
        "Guys you won’t believe what I dreamt of last night I saw...Guys you won’t believe what I dreamt of last night I saw...",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSATHXh1kHWxN7H_dHc2j6vqvaT3_LwQauJ1Q&s",
      stats: { likes: 15, comments: 10, bookmarks: 5 },
    },
    {
      user: {
        name: "John Smith",
        profilePicture:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSATHXh1kHWxN7H_dHc2j6vqvaT3_LwQauJ1Q&s",
      },
      date: "24/01/2025",
      title: "Crazy Ghosts",
      description:
        "Guys you won’t believe what I dreamt of last night I saw...Guys you won’t believe what I dreamt of last night I saw...",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSATHXh1kHWxN7H_dHc2j6vqvaT3_LwQauJ1Q&s",
      stats: { likes: 15, comments: 10, bookmarks: 5 },
    },
  ];
  const [DreamOverlay, setDreamOverlay] = useState(false);

  // Demo code of how to use axios in all the other routes
  const [users, setUsers] = useState();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getUsers = async () => {
      try {
        const response = await axiosPrivate.get("/user", {
          signal: controller.signal,
        });
        // console.log(response.data);
        isMounted && setUsers(response.data);
      } catch (err) {
        // console.error(err);
        if (axios.isCancel(err)) {
          console.log("Request was canceled:", err.message);
        } else if (err.response?.status === 403) {
          console.log("You do not have permission to view this content.");
        } else {
          console.error("API Error:", err.message);
          navigate("/login", { state: { from: location }, replace: true });
        }
      }
    };

    getUsers();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return (
    <div className="flex w-full p-4 gap-4">
      {DreamOverlay && <DreamForm onClose={() => setDreamOverlay(false)} />}

      {/* Main Content */}
      <div className=" p-4 w-full md:w-3/4">
        {/* Action Buttons */}
        <div className="flex gap-8 flex-wrap">
          {/* Dream Count */}
          <div className="rounded-xl flex bg-gradient-to-br from-[#403040] to-[#771D7D] text-white dark:text-black justify-center items-center gap-2 p-3">
            <div className="h-10 w-10 rounded-full bg-[#FC607F] text-2xl font-bold flex justify-center items-center">
              7
            </div>
            <div className=" text-lg">Dreams so far..</div>
          </div>
          {/* Add Dream Option */}
          <Button
            className="h-20 bg-gradient-to-br from-[#403040] to-[#771D7D] dark:bg-white  border-none rounded-xl"
            onClick={() => setDreamOverlay(true)}
          >
            <span className="h-10 w-10 rounded-full bg-[#FC607F] flex justify-center items-center">
              <Plus size="28" strokeWidth={3} />
            </span>
            <span className="text-xl">New Dream</span>
          </Button>
        </div>
        {/* Analytics */}

        <div className="h-[600px] rounded-lg bg-gray-500 text-white text-3xl flex justify-center items-center">
          Analytics Part
        </div>

        {/* Recent Dreams section */}
        <div>
          <h1 className="text-3xl my-4  dark:text-white">Recent Dreams</h1>
          <div className="flex justify-center ">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-4">
              {demoDreams.map((dream) => (
                <DreamCard key={dream.id} dream={dream} />
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Side Content */}
      <div className=" p-4 w-1/4 md:block hidden sticky min-w-fit top-0 max-h-screen overflow-y-auto">
        <h1 className="text-3xl mb-4 dark:text-white">Latest Posts</h1>
        <div className="flex flex-col gap-4">
          {demoPosts.map((post, i) => (
            <PostCard_DashBoard key={i} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}

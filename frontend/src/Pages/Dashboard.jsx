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
      _id: "67f3eba0724cd7acda6a8f40",
      user_id: "67b81535b77aa23e5c58b583",
      title: "getting kidnapped",
      description:
        "I was sitting at a random place and then suddenly a few people came and grabbed me and took me to an unknown and abandoned place. Those people were very scary, and then they started to threaten me, and then because of all the fear, I started to cry, and then I woke up.",
      emotions: ["Sad", "Fearful", "Confused"],
      analysis: {
        sentiment: {
          positive: 0,
          negative: 1,
          neutral: 0,
        },
        keywords: [
          "kidnapped",
          "fear",
          "abandoned",
          "danger",
          "crying",
          "threat",
          "isolation",
        ],
        interpretation:
          "This dream may symbolize feelings of vulnerability, fear of losing control, and a desire to regain a sense of security.",
        image_prompt:
          "A dark, eerie abandoned building with broken windows, surrounded by a foggy atmosphere that evokes a sense of isolation and danger.",
        processed_at: "2025-04-07T15:13:47.979Z",
      },
      analysis_status: "completed",
      date: "2025-04-07T00:00:00.000Z",
      dream_type: "",
      isLiked: true,
      retry_count: 1,
    },
    {
      _id: "76a9a2b8e784a213f9fd4e16",
      user_id: "67b81535b77aa23e5c58b584",
      title: "flying through the sky",
      description:
        "I was soaring high above the city, feeling free and powerful. Everything looked small from above, and I felt like I could do anything.",
      emotions: ["Happy", "Empowered", "Free"],
      analysis: {
        sentiment: {
          positive: 1,
          negative: 0,
          neutral: 0,
        },
        keywords: [
          "flying",
          "freedom",
          "power",
          "sky",
          "soaring",
          "empowerment",
        ],
        interpretation:
          "This dream may symbolize feelings of liberation, empowerment, and control over your own destiny.",
        image_prompt:
          "A vast, clear blue sky with a bird's-eye view of the city below, creating a feeling of boundless freedom and strength.",
        processed_at: "2025-04-15T10:20:47.979Z",
      },
      analysis_status: "completed",
      date: "2025-04-15T00:00:00.000Z",
      dream_type: "",
      isLiked: true,
      retry_count: 0,
    },
    {
      _id: "92f1b7a12d44e8734ff0f1a2",
      user_id: "67b81535b77aa23e5c58b585",
      title: "losing my wallet",
      description:
        "I was at a crowded mall and suddenly realized that my wallet was missing. I searched everywhere, but I couldn't find it, and I felt extremely anxious.",
      emotions: ["Anxious", "Frustrated", "Panicked"],
      analysis: {
        sentiment: {
          positive: 0,
          negative: 1,
          neutral: 0,
        },
        keywords: [
          "wallet",
          "loss",
          "anxiety",
          "crowded",
          "searching",
          "fear",
          "frustration",
        ],
        interpretation:
          "This dream may reflect your worries about losing something valuable or important, potentially symbolizing fear of losing control or security.",
        image_prompt:
          "A bustling, crowded mall with an empty, deserted space where the wallet was lost, creating a sense of panic and helplessness.",
        processed_at: "2025-04-16T13:50:23.979Z",
      },
      analysis_status: "completed",
      date: "2025-04-16T00:00:00.000Z",
      dream_type: "",
      isLiked: false,
      retry_count: 2,
    },
    {
      _id: "cb7c0b7f3424d4e763ebf1a8",
      user_id: "67b81535b77aa23e5c58b586",
      title: "being late for an exam",
      description:
        "I was running through hallways, trying to reach the exam room, but no matter how fast I ran, I was always late. I felt panic and fear as I approached the door, knowing it was already too late.",
      emotions: ["Stressed", "Fearful", "Panicked"],
      analysis: {
        sentiment: {
          positive: 0,
          negative: 1,
          neutral: 0,
        },
        keywords: [
          "exam",
          "late",
          "panic",
          "stress",
          "fear",
          "running",
          "failure",
        ],
        interpretation:
          "This dream may symbolize anxiety related to deadlines, fear of failure, or concerns about being unprepared for important life challenges.",
        image_prompt:
          "A narrow hallway with flickering lights, and an exam room door that looms farther away, emphasizing the feeling of impending failure.",
        processed_at: "2025-04-17T18:30:12.979Z",
      },
      analysis_status: "completed",
      date: "2025-04-17T00:00:00.000Z",
      dream_type: "",
      isLiked: true,
      retry_count: 1,
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
      <div className=" p-4 w-1/4 md:block hidden sticky  top-0 max-h-screen overflow-y-auto">
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

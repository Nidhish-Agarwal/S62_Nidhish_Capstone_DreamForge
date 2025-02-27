import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import EditProfileOverlay from "../components/overlays/EditProfileOverlay";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({});
  const [recentDreams, setRecentDreams] = useState([]);
  const [dreamInterests, setDreamInterests] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getUsers = async () => {
      try {
        const response = await axiosPrivate.get("/user/get_user_data", {
          signal: controller.signal,
        });
        // console.log(response.data);
        isMounted && setUser(response.data.user);
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

  useEffect(() => {
    if (isEditing) {
      document.documentElement.classList.add("overlay-open");
    } else {
      document.documentElement.classList.remove("overlay-open");
    }
  }, [isEditing]);

  const handleSave = (updatedUser) => {
    setUser(updatedUser); // Update user state
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="max-w-3xl w-full mx-auto bg-gradient-to-br from-[#3a0b32] to-[#120515] p-8 rounded-3xl shadow-lg border border-gray-700 text-white">
        {/* Profile Header */}
        <div className="flex items-center gap-6">
          <Avatar className="w-20 h-20">
            <AvatarImage src={user.profileImage} alt="Profile Picture" />
            <AvatarFallback className="text-gray-600 dark:text-white font-bold text-2xl">
              {user?.username
                ? user.username
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .toUpperCase()
                : "?"}
            </AvatarFallback>
          </Avatar>
          <div>
            {/* <h2 className="text-3xl font-bold">{user.name}</h2> */}
            <p className="text-gray-400">{user.username}</p>
            <p className="mt-2 text-gray-300">{user.bio}</p>
          </div>
        </div>

        {/* Dream Statistics */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <Card className="p-4 bg-gray-800 text-center rounded-xl">
            <p className="text-2xl font-bold">{user.dreamCount}</p>
            <p className="text-gray-400 text-sm">Total Dreams</p>
          </Card>
          <Card className="p-4 bg-gray-800 text-center rounded-xl">
            <p className="text-2xl font-bold">
              {/* {user.dreamStats.uniqueEmotions} */} 0
            </p>
            <p className="text-gray-400 text-sm">Unique Emotions</p>
          </Card>
          <Card className="p-4 bg-gray-800 text-center rounded-xl">
            <p className="text-2xl font-bold">{user.streakCount} Days</p>
            <p className="text-gray-400 text-sm">Longest Streak</p>
          </Card>
        </div>

        {/* Edit Profile Button */}
        <div className="mt-6 text-center">
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-gray-600 text-white px-6 py-2 rounded-xl hover:bg-gray-500"
          >
            Edit Profile
          </Button>
        </div>
      </div>

      <div className="max-w-3xl w-full mx-auto bg-gradient-to-br from-[#3a0b32] to-[#120515] p-8 rounded-3xl shadow-lg border border-gray-700 text-white">
        {/* Recent Dreams */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Recent Dreams</h3>
          <ul className="space-y-2">
            {recentDreams.length > 0 ? (
              recentDreams.map((dream, index) => (
                <li
                  key={index}
                  className="p-3 bg-gray-900 rounded-lg text-gray-300"
                >
                  <p className="text-white">{dream.title}</p>
                  <p className="text-gray-500 text-sm">{dream.date}</p>
                </li>
              ))
            ) : (
              <div>Add some dreams to see them here</div>
            )}
          </ul>
        </div>
      </div>

      <div className="max-w-3xl mb-4 w-full mx-auto bg-gradient-to-br from-[#3a0b32] to-[#120515] p-8 rounded-3xl shadow-lg border border-gray-700 text-white">
        {/* Interests */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Dream Interests</h3>
          <div className="flex flex-wrap gap-2">
            {dreamInterests.length > 0 ? (
              dreamInterests.map((interest, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-700 text-sm rounded-lg"
                >
                  {interest}
                </span>
              ))
            ) : (
              <div>Not enough data</div>
            )}
          </div>
        </div>
      </div>

      <EditProfileOverlay
        user={user}
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        onSave={handleSave}
      />
    </div>
  );
};

export default ProfilePage;

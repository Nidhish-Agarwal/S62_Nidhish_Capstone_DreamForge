import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function EditProfileOverlay({ isOpen, onClose, user, onSave }) {
  const [profile, setProfile] = useState({
    name: user?.name || "",
    username: user?.username || "",
    email: user?.email || "",
    bio: user?.bio || "",
    profilePicture: user?.profilePicture || "",
  });

  useEffect(() => {
    setProfile({
      name: user?.name || "",
      username: user?.username || "",
      email: user?.email || "",
      bio: user?.bio || "",
      profilePicture: user?.profilePicture || "",
    });
  }, [user]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfile({ ...profile, profilePicture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChangePassword = () => {
    alert("Password reset email sent!"); // Replace with actual email sending logic
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(profile);
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center transition-opacity ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="bg-gradient-to-br from-[#752345] to-[#352736] text-white p-6 rounded-2xl shadow-xl max-h-[95%] max-w-[95%] w-[550px] overflow-auto relative">
        <button
          className="absolute top-3 right-3 text-gray-300 hover:text-white"
          onClick={onClose}
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <img
              src={profile.profilePicture || "/default-avatar.png"}
              alt="Profile"
              className="w-20 h-20 rounded-full border border-gray-500"
            />
            <div className="flex gap-4">
              <label
                htmlFor="profilePicInput"
                className="cursor-pointer text-sm flex justify-center items-center font-semibold bg-blue-600 px-3 py-1 rounded-lg hover:bg-blue-500"
              >
                Change Picture
              </label>
              <input
                type="file"
                id="profilePicInput"
                className="hidden"
                accept="image/*"
                onChange={handleProfilePictureChange}
              />
              <Button
                className="bg-red-600 hover:bg-red-500 px-3 py-1 text-sm"
                onClick={() => {
                  setProfile((prev) => ({ ...prev, profilePicture: "" }));
                }}
              >
                Delete Picture
              </Button>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Profie Name</label>
            <Input
              type="text"
              name="username"
              value={profile.username}
              onChange={handleChange}
              className="bg-white/25 border-none text-white mt-2"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input
              type="text"
              name="email"
              value={profile.email}
              className="bg-white/25 border-none text-white mt-2"
              disabled
            />
          </div>
          <div>
            <label className="text-sm font-medium">About Me</label>
            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              className="bg-white/25 border-none text-white rounded-lg p-2 w-full resize-none mt-2"
              rows="3"
            ></textarea>
          </div>
        </div>
        <div className="flex justify-between mt-4">
          <Button
            className="bg-gray-700 hover:bg-gray-600"
            onClick={handleChangePassword}
          >
            Change Password
          </Button>
          <Button
            className="justify-self-end bg-[#752345] hover:bg-[#952c5b]"
            onClick={handleSubmit}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}

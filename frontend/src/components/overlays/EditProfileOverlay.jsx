import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";

export default function EditProfileOverlay({ isOpen, onClose, user, onSave }) {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [profile, setProfile] = useState({
    username: user?.username || "",
    email: user?.email || "",
    bio: user?.bio || "",
    profileImage: user?.profileImage || "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setProfile({
      username: user?.username || "",
      email: user?.email || "",
      bio: user?.bio || "",
      profileImage: user?.profileImage || "",
    });
    setHasChanges(false);
  }, [user]);

  const handleChange = (e) => {
    setProfile((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setHasChanges(true);
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfile((prev) => ({ ...prev, profileImage: reader.result }));

        setHasChanges(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeletePicture = () => {
    setProfile((prev) => ({ ...prev, profileImage: "" }));
    setHasChanges(true);
  };

  const handleChangePassword = () => {
    // TODO: Implement actual password reset logic
    toast.success("📩 Password reset email sent!", {
      description: "Check your inbox for reset instructions.",
      duration: 4000,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hasChanges) {
      toast.info("No changes to save");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const formData = new FormData();

      // Only append changed fields
      if (profile.username.trim() !== user.username) {
        formData.append("username", profile.username.trim());
      }
      if (profile.bio.trim() !== user.bio) {
        formData.append("bio", profile.bio.trim());
      }

      // Profile Picture Handling
      if (
        profile.profileImage &&
        profile.profileImage.startsWith("data:image")
      ) {
        // New image uploaded
        const blob = await fetch(profile.profileImage).then((res) =>
          res.blob()
        );
        formData.append("profileImage", blob, "profile.jpg");
      } else if (profile.profileImage === "" && user.profileImage) {
        // Profile picture was deleted
        formData.append("profileImage", "");
      }

      // Prevent unnecessary API calls
      if ([...formData.entries()].length === 0) {
        toast.info("No changes to save");
        return;
      }

      const response = await axiosPrivate.put("/user/update", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        toast.success("🎉 Profile updated successfully!", {
          description: "Your changes are saved.",
          duration: 4000,
          dismissible: true,
        });

        onSave({
          ...user,
          ...response.data.user,
          profileImage: profile.profileImage,
        });

        onClose();
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setErrorMessage("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center transition-opacity ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="bg-gradient-to-br from-[#752345] to-[#352736] text-white p-6 rounded-2xl shadow-xl max-h-[95%] max-w-[95%] w-[550px] overflow-auto relative">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-300 hover:text-white"
          onClick={onClose}
          disabled={loading}
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

        <div className="flex flex-col gap-4">
          {/* Profile Picture */}
          <div className="flex items-center gap-3">
            {/* Profile Picture Preview / Fallback */}
            <Avatar className="w-20 h-20">
              <AvatarImage src={profile.profileImage} alt="Profile Picture" />
              <AvatarFallback className="text-gray-600 dark:text-white font-bold text-2xl">
                {profile?.username
                  ? profile.username
                      .split(" ")
                      .map((word) => word[0])
                      .join("")
                      .toUpperCase()
                  : "?"}
              </AvatarFallback>
            </Avatar>

            <div className="flex gap-4">
              {/* File Input */}
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

              {/* Delete Button */}
              <Button
                className="bg-red-600 hover:bg-red-500 px-3 py-1 text-sm"
                onClick={handleDeletePicture}
                disabled={!profile.profileImage} // Disabled if no profile picture exists
              >
                Delete Picture
              </Button>
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="text-sm font-medium">Profile Name</label>
            <Input
              type="text"
              name="username"
              value={profile.username}
              onChange={handleChange}
              className="bg-white/25 border-none text-white mt-2"
              disabled={loading}
            />
          </div>

          {/* Email */}
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

          {/* Bio */}
          <div>
            <label className="text-sm font-medium">About Me</label>
            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              className="bg-white/25 border-none text-white rounded-lg p-2 w-full resize-none mt-2"
              rows="3"
              disabled={loading}
            ></textarea>
          </div>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <p className="text-red-400 text-center">{errorMessage}</p>
        )}

        {/* Buttons */}
        <div className="flex justify-between mt-4">
          <Button
            className="bg-gray-700 hover:bg-gray-600"
            onClick={handleChangePassword}
            disabled={loading}
          >
            Change Password
          </Button>
          <Button
            className="justify-self-end bg-[#752345] hover:bg-[#952c5b] flex items-center"
            onClick={handleSubmit}
            disabled={loading || !hasChanges}
          >
            {loading ? (
              <Loader2 className="animate-spin mr-2" size={18} />
            ) : null}
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}

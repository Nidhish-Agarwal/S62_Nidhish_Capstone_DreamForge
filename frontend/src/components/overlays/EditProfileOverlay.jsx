import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
    profilePicture: user?.profilePicture || "",
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setProfile({
      username: user?.username || "",
      email: user?.email || "",
      bio: user?.bio || "",
      profilePicture: user?.profilePicture || "",
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
      setUploading(true);
      const reader = new FileReader();
      reader.onload = () => {
        setProfile((prev) => ({ ...prev, profilePicture: reader.result }));
        setUploading(false);
        setHasChanges(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeletePicture = () => {
    setProfile((prev) => ({ ...prev, profilePicture: "" }));
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
    if (!hasChanges) return;

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await axiosPrivate.put("/user/update", profile, {
        withCredentials: true,
      });

      if (response.status === 200) {
        toast.success("🎉 Profile updated successfully!", {
          description: "Your changes are saved.",
          duration: 4000,
          dismissible: true,
        });
        onSave(profile);
        onClose();
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      if (!err?.response) {
        toast.error("❌ Failed to update Profile!", {
          description: "Check your internet connection and try again.",
          duration: 6000,
          dismissible: true,
        });
        setErrorMessage("No server response. Please check your internet.");
      } else if (err.response?.status === 401) {
        setErrorMessage("Session expired. Redirecting to login...");
        setTimeout(() => navigate("/login", { replace: true }), 2000);
      } else {
        toast.warning("⚠️ Something went wrong", {
          description: "Please try again.",
          duration: 5000,
          dismissible: true,
        });
        setErrorMessage("Failed to update profile. Please try again.");
      }
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
                {uploading ? "Uploading..." : "Change Picture"}
              </label>
              <input
                type="file"
                id="profilePicInput"
                className="hidden"
                accept="image/*"
                onChange={handleProfilePictureChange}
                disabled={uploading}
              />
              <Button
                className="bg-red-600 hover:bg-red-500 px-3 py-1 text-sm"
                onClick={handleDeletePicture}
                disabled={loading || !profile.profilePicture}
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
        <div className="flex justify-between mt-6">
          <Button
            className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
            onClick={handleChangePassword}
            disabled={loading}
          >
            Change Password
          </Button>
          <Button
            className="bg-gradient-to-r from-[#9b2249] to-[#752345] hover:from-[#b72c5b] hover:to-[#952c5b] text-white font-semibold py-2 px-5 rounded-lg shadow-lg flex items-center transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
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

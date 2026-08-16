import React, { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../features/user/userSlice.js";
import { useAuth } from "@clerk/react";
import toast from "react-hot-toast";

const ProfileModal = ({ setShowEdit }) => {
  const dispatch = useDispatch();
  const { getToken } = useAuth();

  const user = useSelector((state) => state.user.value);

  const [editForm, setEditForm] = useState({
    username: "",
    bio: "",
    location: "",
    profile_picture: null,
    cover_photo: null,
    full_name: "",
  });

  const [loading, setLoading] = useState(false);

  // Load current user data into form
  useEffect(() => {
    if (user) {
      setEditForm({
        username: user.username || "",
        bio: user.bio || "",
        location: user.location || "",
        profile_picture: null,
        cover_photo: null,
        full_name: user.full_name || "",
      });
    }
  }, [user]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle profile image
  const handleProfileImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setEditForm((prev) => ({
      ...prev,
      profile_picture: file,
    }));
  };

  // Handle cover image
  const handleCoverImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setEditForm((prev) => ({
      ...prev,
      cover_photo: file,
    }));
  };

  // Save profile
  const handleSaveProfile = async (e) => {
    e.preventDefault();

    if (loading) return;

    try {
      setLoading(true);

      const userData = new FormData();

      userData.append("username", editForm.username.trim());
      userData.append("bio", editForm.bio.trim());
      userData.append("location", editForm.location.trim());
      userData.append("full_name", editForm.full_name.trim());

      if (editForm.profile_picture) {
        userData.append("profile", editForm.profile_picture);
      }

      if (editForm.cover_photo) {
        userData.append("cover", editForm.cover_photo);
      }

      const token = await getToken();

      if (!token) {
        throw new Error("Authentication token not found");
      }

      // Debug
      console.log("Updating profile...");
      console.log("Username:", editForm.username);
      console.log("Full Name:", editForm.full_name);

      const result = await dispatch(
        updateUser({
          userData,
          token,
        }),
      ).unwrap();

      console.log("Updated User:", result);

      // Close modal
      setShowEdit(false);
    } catch (error) {
      console.error("Update profile error:", error);

      toast.error(
        error?.message || error?.payload?.message || "Failed to update profile",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Edit Profile</h2>

          <button
            type="button"
            onClick={() => setShowEdit(false)}
            disabled={loading}
            className="text-gray-500 hover:text-gray-800 text-xl disabled:opacity-50"
          >
            ×
          </button>
        </div>

        <form className="p-6 space-y-5" onSubmit={handleSaveProfile}>
          {/* Profile Picture */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Picture
            </label>

            <input
              hidden
              type="file"
              accept="image/*"
              id="profile_picture"
              onChange={handleProfileImage}
            />

            <label
              htmlFor="profile_picture"
              className="relative group/profile block w-24 h-24 cursor-pointer"
            >
              <img
                src={
                  editForm.profile_picture
                    ? URL.createObjectURL(editForm.profile_picture)
                    : user?.profile_picture || "https://via.placeholder.com/150"
                }
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
              />

              <div className="absolute inset-0 hidden group-hover/profile:flex bg-black/30 rounded-full items-center justify-center">
                <Pencil className="w-5 h-5 text-white" />
              </div>
            </label>
          </div>

          {/* Cover Photo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Photo
            </label>

            <input
              hidden
              type="file"
              accept="image/*"
              id="cover_photo"
              onChange={handleCoverImage}
            />

            <label
              htmlFor="cover_photo"
              className="relative group/cover block cursor-pointer"
            >
              <img
                src={
                  editForm.cover_photo
                    ? URL.createObjectURL(editForm.cover_photo)
                    : user?.cover_photo || "https://via.placeholder.com/800x300"
                }
                alt="Cover"
                className="w-full h-40 rounded-xl object-cover"
              />

              <div className="absolute inset-0 hidden group-hover/cover:flex bg-black/30 rounded-xl items-center justify-center">
                <Pencil className="w-6 h-6 text-white" />
              </div>
            </label>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>

            <input
              type="text"
              name="full_name"
              className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-indigo-500"
              placeholder="Please enter your full name"
              value={editForm.full_name}
              onChange={handleChange}
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>

            <input
              type="text"
              name="username"
              className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-indigo-500"
              placeholder="Please enter username"
              value={editForm.username}
              onChange={handleChange}
            />

            <p className="text-xs text-gray-500 mt-1">
              Username must be unique.
            </p>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>

            <textarea
              name="bio"
              rows={3}
              className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-indigo-500 resize-none"
              placeholder="Please enter bio"
              value={editForm.bio}
              onChange={handleChange}
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>

            <input
              type="text"
              name="location"
              className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-indigo-500"
              placeholder="Please enter your location"
              value={editForm.location}
              onChange={handleChange}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => setShowEdit(false)}
              disabled={loading}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;

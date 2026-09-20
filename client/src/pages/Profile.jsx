import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loading from "../components/Loading";
import UserProfileInfo from "../components/UserProfileInfo";
import PostCard from "../components/PostCard";
import moment from "moment";
import ProfileModal from "../components/ProfileModal";
import { useAuth } from "@clerk/react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import api from "../api/axios.js";

const Profile = () => {
  const currentUser = useSelector((state) => state.user.value);

  const { getToken } = useAuth();
  const { profileId } = useParams();

  const [user, setUser] = useState(null);
  const [post, setPost] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");

  const [likedPosts, setLikedPosts] = useState([]);
  const [loadingLikes, setLoadingLikes] = useState(false);

  const [showEdit, setShowEdit] = useState(false);

  // ==========================================
  // FETCH USER PROFILE + POSTS
  // ==========================================

  const fetchUser = async (profileId) => {
    try {
      const token = await getToken();

      const { data } = await api.post(
        "/api/user/profile",
        { profileId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (data.success) {
        setUser(data.profile);
        setPost(data.posts);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("FETCH PROFILE ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to load profile",
      );
    }
  };

  // ==========================================
  // FETCH LIKED POSTS
  // ==========================================

  const fetchLikedPosts = async (profileId) => {
    try {
      setLoadingLikes(true);

      const token = await getToken();

      const { data } = await api.get(`/api/post/liked/${profileId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setLikedPosts(data.posts);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("FETCH LIKED POSTS ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to load liked posts",
      );
    } finally {
      setLoadingLikes(false);
    }
  };

  // ==========================================
  // FETCH PROFILE
  // ==========================================

  useEffect(() => {
    if (profileId) {
      fetchUser(profileId);
    } else if (currentUser?._id) {
      fetchUser(currentUser._id);
    }
  }, [profileId, currentUser?._id]);

  // ==========================================
  // UI
  // ==========================================

  return user ? (
    <div className="relative h-full overflow-y-scroll bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        {/* ================= PROFILE CARD ================= */}

        <div className="bg-white rounded-2xl shadow overflow-hidden">
          {/* Cover Photo */}
          <div className="h-40 md:h-56 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200">
            {user.cover_photo && (
              <img
                src={user.cover_photo}
                alt=""
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* User Information */}
          <UserProfileInfo
            user={user}
            posts={post}
            profileId={profileId}
            setShowEdit={setShowEdit}
          />
        </div>

        {/* ================= TABS ================= */}

        <div className="mt-6">
          <div className="bg-white rounded-xl shadow p-1 flex max-w-md mx-auto">
            {["posts", "media", "likes"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);

                  if (tab === "likes" && user?._id) {
                    fetchLikedPosts(user._id);
                  }
                }}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                  activeTab === tab
                    ? "bg-indigo-600 text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* ================= POSTS ================= */}

        {activeTab === "posts" && (
          <div className="mt-6 flex flex-col items-center gap-6">
            {post.length > 0 ? (
              post.map((item) => <PostCard key={item._id} post={item} />)
            ) : (
              <div className="bg-white rounded-xl shadow p-8 text-center w-full">
                <p className="text-gray-500">No posts yet.</p>
              </div>
            )}
          </div>
        )}

        {/* ================= MEDIA ================= */}

        {activeTab === "media" && (
          <div className="flex flex-wrap gap-4 mt-6 max-w-6xl">
            {post
              .filter((item) => item.image_urls && item.image_urls.length > 0)
              .map((item) => (
                <React.Fragment key={item._id}>
                  {item.image_urls.map((image, index) => (
                    <Link
                      target="_blank"
                      to={image}
                      key={`${item._id}-${index}`}
                      className="relative group"
                    >
                      <img
                        src={image}
                        className="w-64 object-cover aspect-video rounded-lg"
                        alt=""
                      />

                      <p className="absolute bottom-0 right-0 text-xs p-1 px-3 backdrop-blur-xl text-white opacity-0 group-hover:opacity-100 transition duration-300">
                        Posted {moment(item.createdAt).fromNow()}
                      </p>
                    </Link>
                  ))}
                </React.Fragment>
              ))}
          </div>
        )}

        {/* ================= LIKES ================= */}

        {activeTab === "likes" && (
          <div className="mt-6 flex flex-col items-center gap-6">
            {loadingLikes ? (
              <Loading />
            ) : likedPosts.length > 0 ? (
              likedPosts.map((likedPost) => (
                <PostCard key={likedPost._id} post={likedPost} />
              ))
            ) : (
              <div className="bg-white rounded-xl shadow p-8 text-center w-full">
                <p className="text-gray-500">No liked posts yet.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ================= EDIT PROFILE ================= */}

      {showEdit && <ProfileModal setShowEdit={setShowEdit} />}
    </div>
  ) : (
    <Loading />
  );
};

export default Profile;

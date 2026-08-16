import React, { useEffect, useState } from "react";
import {
  Users,
  UserPlus,
  UserCheck,
  UserRoundPen,
  MessageSquare,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useAuth } from "@clerk/react";
import { fetchConnections } from "../features/connections/connectionsSlice";
import api from "../api/axios";
import toast from "react-hot-toast";

const Connection = () => {
  const [currentTab, setCurrentTab] = useState("Followers");

  const navigate = useNavigate();
  const { getToken } = useAuth();
  const dispatch = useDispatch();

  const {
    connections = [],
    pendingConnections = [],
    followers = [],
    following = [],
  } = useSelector((state) => state.connections);

  // =========================
  // Data for tabs
  // =========================

  const dataArray = [
    {
      label: "Followers",
      value: followers || [],
      icon: Users,
    },
    {
      label: "Following",
      value: following || [],
      icon: UserCheck,
    },
    {
      label: "Pending",
      value: pendingConnections || [],
      icon: UserRoundPen,
    },
    {
      label: "Connections",
      value: connections || [],
      icon: UserPlus,
    },
  ];

  // =========================
  // Unfollow
  // =========================

  const handleUnfollow = async (userId) => {
    try {
      const token = await getToken();

      const { data } = await api.post(
        "/api/user/unfollow",
        { id: userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (data.success) {
        toast.success(data.message);

        dispatch(fetchConnections(token));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Unfollow error:", error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // =========================
  // Accept Connection
  // =========================

  const acceptConnection = async (userId) => {
    try {
      const token = await getToken();

      const { data } = await api.post(
        "/api/user/accept",
        { id: userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (data.success) {
        toast.success(data.message);

        dispatch(fetchConnections(token));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Accept connection error:", error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // =========================
  // Fetch connections
  // =========================

  useEffect(() => {
    const loadConnections = async () => {
      try {
        const token = await getToken();

        if (token) {
          dispatch(fetchConnections(token));
        }
      } catch (error) {
        console.error("Fetch connections error:", error);
      }
    };

    loadConnections();
  }, [getToken, dispatch]);

  // =========================
  // Current tab users
  // =========================

  const selectedTab = dataArray.find((item) => item.label === currentTab);

  const users = selectedTab?.value || [];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* =========================
            Title
        ========================= */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Connections
          </h1>

          <p className="text-slate-600">
            Manage your network and discover new connections
          </p>
        </div>

        {/* =========================
            Counts
        ========================= */}

        <div className="mb-8 flex flex-wrap gap-6">
          {dataArray.map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center justify-center gap-1 border h-20 w-40 border-gray-200 bg-white shadow rounded-md"
            >
              <b>{item.value?.length || 0}</b>

              <p className="text-slate-600">{item.label}</p>
            </div>
          ))}
        </div>

        {/* =========================
            Tabs
        ========================= */}

        <div className="inline-flex flex-wrap items-center border border-gray-200 rounded-md p-1 bg-white shadow-sm">
          {dataArray.map((tab) => {
            const Icon = tab.icon;

            return (
              <button
                key={tab.label}
                onClick={() => setCurrentTab(tab.label)}
                className={`
                  flex items-center px-3 py-2 text-sm rounded-md
                  transition-colors cursor-pointer
                  ${
                    currentTab === tab.label
                      ? "bg-indigo-600 font-medium text-white"
                      : "text-gray-500 hover:text-black"
                  }
                `}
              >
                <Icon className="w-4 h-4" />

                <span className="ml-1">{tab.label}</span>

                <span className="ml-2 text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                  {tab.value?.length || 0}
                </span>
              </button>
            );
          })}
        </div>

        {/* =========================
            User Profiles
        ========================= */}

        <div className="flex flex-wrap gap-6 mt-6">
          {users.length === 0 ? (
            <div className="w-full bg-white rounded-md shadow p-10 text-center">
              <p className="text-gray-500">
                No {currentTab.toLowerCase()} found.
              </p>
            </div>
          ) : (
            users.map((user) => (
              <div
                key={user._id}
                className="w-full max-w-md flex gap-5 p-6 bg-white shadow rounded-md"
              >
                {/* Profile Image */}

                <img
                  src={
                    user.profile_picture || "https://via.placeholder.com/100"
                  }
                  alt="user-profile"
                  className="rounded-full w-12 h-12 shadow-md object-cover"
                />

                <div className="flex-1">
                  {/* Name */}

                  <p className="font-medium text-slate-700">
                    {user.full_name || "Unknown User"}
                  </p>

                  {/* Username */}

                  <p className="font-medium text-gray-500">
                    @{user.username || "username"}
                  </p>

                  {/* Bio */}

                  <p className="text-sm text-gray-600 mt-1">
                    {user.bio
                      ? user.bio.slice(0, 30) +
                        (user.bio.length > 30 ? "..." : "")
                      : "No bio available"}
                  </p>

                  {/* Buttons */}

                  <div className="flex max-sm:flex-col gap-2 mt-4">
                    {/* View Profile */}

                    <button
                      onClick={() => navigate(`/profile/${user._id}`)}
                      className="w-full p-2 text-sm rounded bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition text-white cursor-pointer"
                    >
                      View Profile
                    </button>

                    {/* Following */}

                    {currentTab === "Following" && (
                      <button
                        onClick={() => handleUnfollow(user._id)}
                        className="w-full p-2 text-sm rounded bg-slate-100 hover:bg-slate-200 text-black active:scale-95 transition cursor-pointer"
                      >
                        Unfollow
                      </button>
                    )}

                    {/* Pending */}

                    {currentTab === "Pending" && (
                      <button
                        onClick={() => acceptConnection(user._id)}
                        className="w-full p-2 text-sm rounded bg-slate-100 hover:bg-slate-200 text-black active:scale-95 transition cursor-pointer"
                      >
                        Accept
                      </button>
                    )}

                    {/* Connections */}

                    {currentTab === "Connections" && (
                      <button
                        onClick={() => navigate(`/messages/${user._id}`)}
                        className="w-full p-2 text-sm rounded bg-slate-100 hover:bg-slate-200 text-slate-800 active:scale-95 transition cursor-pointer flex items-center justify-center gap-1"
                      >
                        <MessageSquare className="w-4 h-4" />
                        Message
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Connection;

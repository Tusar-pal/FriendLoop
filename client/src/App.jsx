import React, { useEffect, useRef } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import Login from "./pages/Login";
import Feed from "./pages/Feed";
import Messages from "./pages/Messages";
import ChatBox from "./pages/ChatBox";
import Connection from "./pages/Connection";
import Discover from "./pages/Discover";
import Profile from "./pages/Profile";
import CreatePost from "./pages/CreatePost";
import Layout from "./pages/Layout";
import Notification from "./components/Notification";

import { useAuth, useUser } from "@clerk/react";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { fetchUser } from "./features/user/userSlice";
import { fetchConnections } from "./features/connections/connectionsSlice";
import { addMessage } from "./features/messages/messagesSlice";

const App = () => {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const { pathname } = useLocation();
  const pathnameRef = useRef(pathname);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      if (!isLoaded || !user) return;

      try {
        const token = await getToken();

        if (!token) return;

        await dispatch(fetchUser(token)).unwrap();
        await dispatch(fetchConnections(token)).unwrap();
      } catch (error) {
        console.error("Fetch user/connections error:", error);
      }
    };

    fetchData();
  }, [user, isLoaded, getToken, dispatch]);

  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const eventSource = new EventSource(
      `${import.meta.env.VITE_BASEURL}/api/message/${user.id}`,
    );

    eventSource.onmessage = (event) => {
      try {
        if (!event.data) return;

        const message = JSON.parse(event.data);

        const senderId =
          message?.from_user_id?._id ||
          message?.from_user_id ||
          message?.senderId;

        if (!senderId) return;

        const currentChatUserId = pathnameRef.current.startsWith("/messages/")
          ? pathnameRef.current.split("/messages/")[1]
          : null;

        if (currentChatUserId === senderId) {
          dispatch(addMessage(message));
          return;
        }

        toast.custom((t) => <Notification t={t} message={message} />, {
          position: "bottom-right",
          duration: 4000,
        });
      } catch (error) {
        console.error("SSE message error:", error);
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE connection error:", error);
    };

    return () => {
      eventSource.close();
    };
  }, [user, isLoaded, dispatch]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Toaster />

      <Routes>
        <Route path="/" element={!user ? <Login /> : <Layout />}>
          <Route index element={<Feed />} />
          <Route path="messages" element={<Messages />} />
          <Route path="messages/:userId" element={<ChatBox />} />
          <Route path="connections" element={<Connection />} />
          <Route path="discover" element={<Discover />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/:profileId" element={<Profile />} />
          <Route path="create-post" element={<CreatePost />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;

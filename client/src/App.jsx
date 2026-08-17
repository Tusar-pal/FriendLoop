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

import { useAuth, useUser } from "@clerk/react";
import { Toaster } from "react-hot-toast";
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

  // Fetch user and connections
  useEffect(() => {
    const fetchData = async () => {
      if (!isLoaded || !user) {
        return;
      }

      try {
        const token = await getToken();

        if (token) {
          await dispatch(fetchUser(token)).unwrap();
          await dispatch(fetchConnections(token));
        }
      } catch (error) {
        console.error("Fetch user error:", error);
      }
    };

    fetchData();
  }, [user, isLoaded, getToken, dispatch]);

  // Track current pathname
  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  // Server Sent Events for messages
  useEffect(() => {
    if (!isLoaded || !user) {
      return;
    }

    const eventSource = new EventSource(
      import.meta.env.VITE_BASEURL + "/api/message/" + user.id,
    );

    eventSource.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);

        if (pathnameRef.current === "/messages/" + message.from_user_id._id) {
          dispatch(addMessage(message));
        }
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

  // Loading screen
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

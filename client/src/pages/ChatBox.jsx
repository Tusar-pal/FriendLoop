import React, { useEffect, useRef, useState } from "react";
import { dummyMessagesData, dummyUserData } from "../assets/assets";
import { ImageIcon, SendHorizontal } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useAuth } from "@clerk/react";
import api from "../api/axios";
import toast from "react-hot-toast";
import {
  addMessage,
  fetchMessages,
  resetMessages,
} from "../features/messages/messagesSlice";
const ChatBox = () => {
  const messages = useSelector((state) => state.messages.messages || []);

  const { userId } = useParams();
  const { getToken, userId: currentUserId } = useAuth();
  const dispatch = useDispatch();

  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [user, setUser] = useState(null);

  const messagesEndRef = useRef(null);

  const connections = useSelector((state) => state.connections.connections);

  const fetchUserMessages = async () => {
    try {
      const token = await getToken();

      dispatch(
        fetchMessages({
          token,
          userId,
        }),
      );
    } catch (error) {
      toast.error(error.message);
    }
  };

  const sendMessage = async () => {
    try {
      if (!text.trim() && !image) return;

      const token = await getToken();

      const formData = new FormData();

      formData.append("to_user_id", userId);
      formData.append("text", text);

      if (image) {
        formData.append("image", image);
      }

      const { data } = await api.post("/api/message/send", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setText("");
        setImage(null);

        // Immediately show sent message
        dispatch(addMessage(data.message));
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.log("SEND MESSAGE ERROR:", error);
      toast.error(error.response?.data?.message || error.message);
    }
  };
  useEffect(() => {
    if (!currentUserId) return;

    const eventSource = new EventSource(
      `${import.meta.env.VITE_BACKEND_URL}/api/message/sse/${currentUserId}`,
    );

    eventSource.onmessage = (event) => {
      try {
        const newMessage = JSON.parse(event.data);

        if (newMessage?._id) {
          dispatch(addMessage(newMessage));
        }
      } catch (error) {
        console.log("SSE MESSAGE ERROR:", error);
      }
    };

    eventSource.onerror = (error) => {
      console.log("SSE CONNECTION ERROR:", error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [currentUserId, dispatch]);

  useEffect(() => {
    fetchUserMessages();

    return () => {
      dispatch(resetMessages());
    };
  }, [userId]);

  useEffect(() => {
    if (connections.length > 0) {
      const foundUser = connections.find(
        (connection) => connection._id === userId,
      );

      setUser(foundUser);
    }
  }, [connections, userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);
return (
  user && (
    <div className="flex flex-col h-screen">

      {/* Header */}
      <div className="flex items-center gap-2 p-2 md:px-10 xl:pl-42 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-300">
        <img
          src={user.profile_picture}
          alt=""
          className="size-8 rounded-full"
        />

        <div>
          <p className="font-medium">{user.full_name}</p>
          <p className="text-sm text-gray-500 -mt-1.5">
            @{user.username}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="p-5 md:px-10 h-full overflow-y-scroll">
        <div className="space-y-4 max-w-4xl mx-auto">

          {[...messages]
            .filter((message) => message)
            .sort(
              (a, b) =>
                new Date(a.createdAt) - new Date(b.createdAt)
            )
            .map((message, index) => {

              const senderId =
                typeof message.from_user_id === "object"
                  ? message.from_user_id?._id
                  : message.from_user_id;

              const isMe =
                String(senderId) === String(currentUserId);

              return (
                <div
                  key={message._id || index}
                  className={`flex w-full ${
                    isMe ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`p-2 text-sm max-w-sm rounded-lg shadow ${
                      isMe
                        ? "bg-green-100 text-slate-800 rounded-br-none"
                        : "bg-white text-slate-700 rounded-bl-none"
                    }`}
                  >

                    {/* Image Message */}
                    {message.message_type === "image" && (
                      <img
                        src={message.media_url}
                        className="w-full max-w-sm rounded-lg mb-1"
                        alt=""
                      />
                    )}

                    {/* Text Message */}
                    {message.text && (
                      <p>{message.text}</p>
                    )}

                  </div>
                </div>
              );
            })}

          <div ref={messagesEndRef} />

        </div>
      </div>

      {/* Input Box */}
      <div className="px-4">
        <div className="flex items-center gap-3 pl-5 p-1.5 bg-white w-full max-w-xl mx-auto border border-gray-200 shadow rounded-full mb-5">

          <input
            type="text"
            className="flex-1 outline-none text-slate-700"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          {/* Image */}
          <label
            htmlFor="image"
            className="cursor-pointer text-gray-500"
          >
            {image ? (
              <img
                src={URL.createObjectURL(image)}
                alt=""
                className="h-8 rounded"
              />
            ) : (
              <ImageIcon className="w-4 h-4" />
            )}

            <input
              type="file"
              id="image"
              accept="image/*"
              hidden
              onChange={(e) =>
                setImage(e.target.files[0])
              }
            />
          </label>

          {/* Send Button */}
          <button
            onClick={sendMessage}
            className="bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95 cursor-pointer text-white p-2 rounded-full"
          >
            <SendHorizontal size={18} />
          </button>

        </div>
      </div>

    </div>
  )
);
};

export default ChatBox;

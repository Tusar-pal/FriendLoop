import { BadgeCheck, Heart, MessageCircle, Share2 } from "lucide-react";

import React, { useState } from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "@clerk/react";
import toast from "react-hot-toast";
import api from "../api/axios";

const PostCard = ({ post }) => {
  const navigate = useNavigate();

  const postWithHashtags = post.content.replace(
    /(#\w+)/g,
    '<span class="text-indigo-600">$1</span>',
  );

  // =========================
  // LIKE
  // =========================

  const [likes, setLikes] = useState(post.likes_count);

  // =========================
  // COMMENT STATES
  // =========================

  const [showComments, setShowComments] = useState(false);

  const [comment, setComment] = useState("");

  const [comments, setComments] = useState([]);

  const [loadingComment, setLoadingComment] = useState(false);

  const [loadingComments, setLoadingComments] = useState(false);

  // =========================
  // USER & AUTH
  // =========================

  const currentUser = useSelector((state) => state.user.value);

  const { getToken } = useAuth();

  // =====================================================
  // LIKE FUNCTION
  // =====================================================

  const handleLike = async () => {
    try {
      const { data } = await api.post(
        `/api/post/like`,
        {
          postId: post._id,
        },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        },
      );

      if (data.success) {
        toast.success(data.message);

        setLikes((prev) => {
          if (prev.includes(currentUser._id)) {
            return prev.filter((id) => id !== currentUser._id);
          } else {
            return [...prev, currentUser._id];
          }
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // =====================================================
  // GET COMMENTS
  // =====================================================

  const fetchComments = async () => {
    try {
      setLoadingComments(true);

      const token = await getToken();

      const { data } = await api.get(`/api/comment/${post._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setComments(data.comments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("FETCH COMMENTS ERROR:", error);
      console.log("SERVER ERROR:", error.response?.data);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to load comments",
      );
    } finally {
      setLoadingComments(false);
    }
  };

  // =====================================================
  // COMMENT BUTTON
  // =====================================================

  const handleCommentButton = () => {
    setShowComments((prev) => !prev);

    // Only fetch when opening comments
    if (!showComments) {
      fetchComments();
    }
  };

  // =====================================================
  // ADD COMMENT
  // =====================================================

  const handleComment = async () => {
    // Empty comment check
    if (!comment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    try {
      setLoadingComment(true);

      const token = await getToken();

      const { data } = await api.post(
        `/api/comment/${post._id}`,
        {
          text: comment.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (data.success) {
        // Add new comment at top
        setComments((prev) => [data.comment, ...prev]);

        // Clear input
        setComment("");

        toast.success("Comment added");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("ADD COMMENT ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to add comment",
      );
    } finally {
      setLoadingComment(false);
    }
  };

  // =====================================================
  // ENTER KEY COMMENT
  // =====================================================

  const handleCommentKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      handleComment();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 space-y-4 w-full max-w-2xl mt-4">
      {/* ================================================= */}
      {/* USER INFO */}
      {/* ================================================= */}

      <div
        onClick={() => navigate("/profile/" + post.user._id)}
        className="inline-flex items-center gap-3 cursor-pointer"
      >
        <img
          src={post.user.profile_picture}
          alt=""
          className="w-10 h-10 rounded-full shadow"
        />

        <div>
          <div className="flex items-center space-x-1">
            <span>{post.user.full_name}</span>

            <BadgeCheck className="w-4 h-4 text-blue-500" />
          </div>

          <div className="text-gray-500 text-sm">
            {post.user.email} • {moment(post.createdAt).fromNow()}
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* POST CONTENT */}
      {/* ================================================= */}

      {post.content && (
        <div
          className="text-gray-800 text-sm whitespace-pre-line"
          dangerouslySetInnerHTML={{
            __html: postWithHashtags,
          }}
        />
      )}

      {/* ================================================= */}
      {/* POST IMAGES */}
      {/* ================================================= */}

      <div className="grid grid-cols-2 gap-2">
        {post.image_urls.map((img, index) => (
          <img
            src={img}
            key={index}
            alt="image"
            className={`w-full h-48 object-cover rounded-lg ${
              post.image_urls.length === 1 && "col-span-2 h-auto"
            }`}
          />
        ))}
      </div>

      {/* ================================================= */}
      {/* ACTIONS */}
      {/* ================================================= */}

      <div className="flex items-center gap-4 text-gray-600 text-sm pt-2 border-t border-gray-300">
        {/* ================= LIKE ================= */}

        <div className="flex items-center gap-1">
          <Heart
            className={`w-4 h-4 cursor-pointer ${
              likes.includes(currentUser._id) && "text-red-500 fill-red-500"
            }`}
            onClick={handleLike}
          />

          <span>{likes.length}</span>
        </div>

        {/* ================= COMMENT ================= */}

        <div
          className="flex items-center gap-1 cursor-pointer"
          onClick={handleCommentButton}
        >
          <MessageCircle className="w-4 h-4" />

          <span>{comments.length}</span>
        </div>

        {/* ================= SHARE ================= */}

        <div className="flex items-center gap-1">
          <Share2 className="w-4 h-4" />

          <span>{7}</span>
        </div>
      </div>

      {/* ================================================= */}
      {/* COMMENTS SECTION */}
      {/* ================================================= */}

      {showComments && (
        <div className="border-t border-gray-200 pt-3">
          {/* ================= COMMENT INPUT ================= */}

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={handleCommentKeyDown}
              placeholder="Write a comment..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm outline-none focus:border-indigo-500"
            />

            <button
              onClick={handleComment}
              disabled={loadingComment}
              className="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white px-4 py-2 rounded-full text-sm"
            >
              {loadingComment ? "..." : "Post"}
            </button>
          </div>

          {/* ================= COMMENTS LIST ================= */}

          <div className="mt-4 space-y-3">
            {loadingComments ? (
              <p className="text-center text-gray-400 text-sm">
                Loading comments...
              </p>
            ) : comments.length === 0 ? (
              <p className="text-center text-gray-400 text-sm">
                No comments yet.
              </p>
            ) : (
              comments.map((item) => (
                <div key={item._id} className="flex items-start gap-2">
                  {/* USER IMAGE */}

                  <img
                    src={item.user_id?.profile_picture}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover"
                  />

                  {/* COMMENT */}

                  <div className="bg-gray-100 rounded-lg px-3 py-2">
                    <p className="font-medium text-sm">
                      {item.user_id?.full_name ||
                        item.user_id?.username ||
                        "User"}
                    </p>

                    <p className="text-sm text-gray-600">{item.text}</p>

                    <p className="text-[10px] text-gray-400 mt-1">
                      {moment(item.createdAt).fromNow()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;

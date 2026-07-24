import React, { useEffect, useState } from "react";
import { dummyStoriesData } from "../assets/assets";
import { Plus } from "lucide-react";
import moment from "moment";
import StoryModel from "./StoryModel";
import StoryViewer from "./StoryViewer";

const StoriesBar = () => {
  const [stories, setStories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [viewStory, setViewStory] = useState(null);

  const fetchStories = async () => {
    setStories(dummyStoriesData);
  };

  useEffect(() => {
    fetchStories();
  }, []);

  return (
    <div className="w-full overflow-x-auto no-scrollbar scroll-smooth">
      <div className="flex gap-4 pb-5 snap-x snap-mandatory">
        {/* Create Story */}
        <div
          onClick={() => setShowModal(true)}
          className="snap-start min-w-[110px] h-[160px] flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-indigo-300 bg-gradient-to-b from-indigo-50 to-white cursor-pointer hover:shadow-md transition"
        >
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-500 mb-2">
            <Plus className="text-white w-5 h-5" />
          </div>
          <p className="text-sm font-medium text-gray-700 text-center">
            Create Story
          </p>
        </div>

        {/* Stories */}
        {stories.map((story, index) => (
          <div
            key={index}
            onClick={() => setViewStory(story)}
            className="snap-start relative rounded-lg shadow min-w-[110px] h-[160px] cursor-pointer hover:shadow-lg transition-all duration-200 bg-gradient-to-b from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95"
          >
            {/* Profile */}
            <img
              src={story.user.profile_picture}
              alt=""
              className="absolute w-8 h-8 top-3 left-3 z-10 rounded-full ring ring-gray-100 shadow"
            />

            {/* Content */}
            <p className="absolute top-[70px] left-3 text-white/70 text-sm truncate max-w-[90px]">
              {story.content}
            </p>

            {/* Time */}
            <p className="absolute text-white bottom-1 right-2 z-10 text-xs">
              {moment(story.createdAt).fromNow()}
            </p>

            {/* Media */}
            {story.media_type !== "text" && (
              <div className="absolute inset-0 z-0 rounded-lg overflow-hidden">
                {story.media_type === "image" ? (
                  <img
                    src={story.media_url}
                    alt=""
                    className="h-full w-full object-cover opacity-70 hover:opacity-80 transition duration-500"
                  />
                ) : (
                  <video
                    src={story.media_url}
                    className="h-full w-full object-cover opacity-70 hover:opacity-80 transition duration-500"
                  />
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Story Modal */}
      {showModal && (
        <StoryModel setShowModal={setShowModal} fetchStories={fetchStories} />
      )}

      {/* View Story */}
      {viewStory && (
        <StoryViewer viewStory={viewStory} setViewStory={setViewStory} />
      )}
    </div>
  );
};

export default StoriesBar;

import React, { useEffect, useState } from "react";
import { assets, dummyPostsData } from "../assets/assets";
import Loading from "../components/Loading";
import StoriesBar from "../components/StoriesBar";
import PostCard from "../components/PostCard";
import ResentMessages from "../components/ResentMessages";

const Feed = () => {
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setFeeds(dummyPostsData);
    setLoading(false);
  }, []);

  return !loading ? (
    <div className="py-6">
      <div className="max-w-7xl mx-auto flex gap-8 px-4">
        {/* Feed Section */}
        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-2xl">
            <StoriesBar />

            <div className="mt-4 space-y-6">
              {feeds.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="hidden xl:block w-80 sticky top-6 self-start">
          <div className="bg-white rounded-md shadow p-4 text-xs flex flex-col gap-2">
            <h3 className="text-slate-800 font-semibold">Sponsored</h3>

            <img
              src={assets.sponsored_img}
              alt=""
              className="w-full rounded-md"
            />

            <p className="text-slate-600">Email marketing</p>

            <p className="text-slate-400">
              Supercharge our marketing with a powerful, easy-to-use platform
              built for results.
            </p>
          </div>

          <div className="mt-4">
            <ResentMessages />
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Feed;

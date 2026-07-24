import React from "react";
import { assets, dummyUserData } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import MenuItems from "./MenuItems";
import { CirclePlus, LogOut } from "lucide-react";
import {UserButton,useClerk} from '@clerk/react'
const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
    const user =dummyUserData
    const {signOut} = useClerk();
  return (
    <div
      className={`w-60 xl:w-72 bg-white border-r border-gray-200 flex flex-col max-sm:absolute top-0 bottom-0 z-20 ${sidebarOpen ? "translate-x-0" : "max-sm:translate-x-full"} transition-all duration-300`}
    >
      {/* Logo */}
      <div onClick={() => navigate("/")} className="w-full">
        <img src={assets.logo} className="h-8 ml-6 my-4 cursor-pointer" />
        <hr className="border-gray-300 mb-4" />
      </div>

      {/* Menu (takes space) */}
      <div className="flex-1">
        <MenuItems setSidebarOpen={setSidebarOpen} />
        <Link
          to="/create-post"
          className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95 transition text-white ml-4 mr-4 mt-3"
        >
          <CirclePlus className="w-5 h-5" />
          Create Post
        </Link>
      </div>

      {/* Bottom Section */}
      <div className="px-6 pb-4 space-y-4">
        {/* Create Post Button */}
        

        {/* User Section */}
        <div className="border-t pt-4 flex items-center justify-between">
          <div className="flex gap-2 items-center cursor-pointer">
            <UserButton />
            <div>
              <h1 className="text-sm font-medium">{user.full_name}</h1>
              <p className="text-xs text-gray-500">@{user.username}</p>
            </div>
          </div>

          <LogOut
            onClick={signOut}
            className="w-5 text-gray-400 hover:text-gray-700 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

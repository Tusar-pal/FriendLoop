import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import Loading from "../components/Loading";
import { useSelector } from "react-redux";

const Layout = () => {
  const user = useSelector((state)=>state.user.value);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return user ? (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto bg-slate-50">
        <Outlet />
      </main>

      {sidebarOpen ? (
        <X
          className="absolute top-3 right-3 p-2 z-[100] bg-white rounded-md shadow w-10 h-10 text-gray-600 sm:hidden cursor-pointer"
          onClick={() => setSidebarOpen(false)}
        />
      ) : (
        <Menu
          className="absolute top-3 right-3 p-2 z-[100] bg-white rounded-md shadow w-10 h-10 text-gray-600 sm:hidden cursor-pointer"
          onClick={() => setSidebarOpen(true)}
        />
      )}
    </div>
  ) : (
    <Loading />
  );
};

export default Layout;

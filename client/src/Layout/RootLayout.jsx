import React from "react";
import Sidebar from "../Components/Sidebar";
import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar";

const RootLayout = () => {
  return (
    <div className="flex flex-row h-screen ">
      <div className="fixed h-full z-50">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden lg:pl-72">
        {/* <Navbar /> */}
        <div className="flex-1 overflow-y-scroll no-scrollbar bg-gray-200 px-4 lg:py-12 py-20">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default RootLayout;

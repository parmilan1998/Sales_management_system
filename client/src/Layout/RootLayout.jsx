import React from "react";
import Sidebar from "../Components/Sidebar";
import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar";

const RootLayout = () => {
  return (
    <div className="flex flex-row h-screen overflow-hidden">
      <div className="fixed h-full">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden lg:pl-60">
        <Navbar />
        <div className="flex-1 overflow-y-auto bg-gray-200 p-4 ">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default RootLayout;

import React from "react";
import Sidebar from "../Components/Sidebar";
import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar";

const RootLayout = () => {
  return (
    <div className="min-h-screen grid grid-cols-12 bg-gray-200">
      <div className="lg:col-span-2">
        <Sidebar />
      </div>
      <div className="col-span-10 lg:pl-16 flex flex-col w-full h-[100%] bg-gray-200">
        <Navbar />
        <div className="py-2 bg-gray-200 h-[100%]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default RootLayout;

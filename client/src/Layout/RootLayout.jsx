import React from "react";
import Sidebar from "../Components/Sidebar";
import { Outlet } from "react-router-dom";
import Home from "../Components/Home";
import Dashboard from "../Pages/Dashboard";
import Navbar from "../Components/Navbar";

const RootLayout = () => {
  return (
    <div className="flex flex-row">
      <Sidebar />
      <div className="w-full bg-gray-200">
        <Navbar />
        <div className="w-full px-10 py-5 font-poppins">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default RootLayout;

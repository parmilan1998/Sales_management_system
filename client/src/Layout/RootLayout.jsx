import React from "react";
import Sidebar from "../Components/Sidebar";
import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar";

const RootLayout = () => {
  return (
    <div className="grid grid-cols-4 bg-slate-200">
      <div className="col-span-1">
        <Sidebar />
      </div>
      <div className="col-span-3 my-3 bg-gray-200">
        <Outlet />
      </div>
    </div>
  );
};

export default RootLayout;

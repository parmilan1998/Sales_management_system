import React, { useEffect, useState } from "react";
import { SiPowerapps } from "react-icons/si";
import { Link, useNavigate } from "react-router-dom";
import { BiCategoryAlt } from "react-icons/bi";
import { FaShopify, FaTag } from "react-icons/fa6";
import { BiSolidReport } from "react-icons/bi";
import { IoIosLogOut, IoIosSettings } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { logout, logOutAdmin } from "../features/authSlice";
import toast from "react-hot-toast";
import { Tooltip } from "antd";
import LoginScreen from "../Pages/Admin/LoginScreen";
import { jwtDecode } from "jwt-decode";
import { LuGanttChartSquare } from "react-icons/lu";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { MdOutlineCurrencyExchange } from "react-icons/md";
import { PiWarehouseLight } from "react-icons/pi";

export default function Sidebar() {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      navigate("/user/login");
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      await dispatch(logOutAdmin());
      dispatch(logout());
      navigate("/");
      toast.success("Logged out successfully!");
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      const expTime = decodedToken.exp;

      const expiryTime = (expTime - currentTime) * 1000;

      if (expiryTime > 0) {
        const timer = setTimeout(() => {
          dispatch(logout());
        }, expiryTime);

        return () => clearTimeout(timer);
      } else {
        dispatch(logout());
      }
    }
  }, [dispatch]);

  return (
    <>
      <button
        title="Side navigation"
        type="button"
        className={`visible fixed flex justify-end right-8 top-6 z-40 order-10 h-10 w-10 self-center rounded bg-gray-300 opacity-100 lg:hidden ${
          isSideNavOpen
            ? "visible opacity-100 [&_span:nth-child(1)]:w-6 [&_span:nth-child(1)]:translate-y-0 [&_span:nth-child(1)]:rotate-45 [&_span:nth-child(3)]:w-0 [&_span:nth-child(2)]:-rotate-45 "
            : ""
        }`}
        aria-haspopup="menu"
        aria-label="Side navigation"
        aria-expanded={isSideNavOpen ? " true" : "false"}
        aria-controls="nav-menu-4"
        onClick={() => setIsSideNavOpen(!isSideNavOpen)}
      >
        <div className="absolute top-1/2 left-1/2 w-6 -translate-x-1/2 -translate-y-1/2 transform">
          <span
            aria-hidden="true"
            className="absolute block h-0.5 w-9/12 -translate-y-2 transform rounded-full bg-slate-700 transition-all duration-300"
          ></span>
          <span
            aria-hidden="true"
            className="absolute block h-0.5 w-6 transform rounded-full bg-slate-900 transition duration-300"
          ></span>
          <span
            aria-hidden="true"
            className="absolute block h-0.5 w-1/2 origin-top-left translate-y-2 transform rounded-full bg-slate-900 transition-all duration-300"
          ></span>
        </div>
      </button>

      <aside
        id="nav-menu-4"
        aria-label="Side navigation"
        className={`fixed z-50 bg-primary font-poppins text-white top-0 bottom-0 left-0 flex w-72 flex-col border-r border-r-slate-200 transition-transform lg:translate-x-0 ${
          isSideNavOpen ? "translate-x-0" : " -translate-x-full"
        }`}
      >
        <div className="flex flex-col items-center gap-4 p-6">
          <span className="flex flex-row items-center justify-start pt-5 w-full place-content-center rounded-lg text-3xl font-acme font-medium tracking-widest">
            <SiPowerapps className="mr-2 text-primaryRed" />
            <span className=" text-primaryRed">Vital</span> <span>Mart</span>
          </span>
        </div>
        <nav
          aria-label="side navigation"
          className="flex-1 text-white overflow-auto"
        >
          <div>
            <ul className="flex flex-1 flex-col gap-1 pt-0">
              <li className="px-3">
                <Link
                  to="/"
                  className="flex items-center gap-3 rounded p-3 transition-colors focus:text-emerald-500 text-white hover:text-emerald-500"
                >
                  <div className="flex items-center self-center">
                    <LuGanttChartSquare size={20} />
                  </div>
                  <div className="flex w-full flex-1 font-light tracking-wider flex-col items-start justify-center gap-0 overflow-hidden truncate text-sm">
                    Dashboard
                  </div>
                </Link>
              </li>
              <li className="px-3">
                <Link
                  to="/category"
                  className="flex items-center gap-3 rounded p-3 transition-colors focus:text-emerald-500 text-white hover:text-emerald-500"
                >
                  <div className="flex items-center self-center ">
                    <BiCategoryAlt size={20} />
                  </div>
                  <div className="flex w-full flex-1 font-light tracking-wider flex-col items-start justify-center gap-0 overflow-hidden truncate text-sm">
                    Category
                  </div>
                  {/* <span className="inline-flex items-center justify-center rounded-full bg-pink-100 px-2 text-xs text-pink-500 ">
                    2<span className="sr-only"> new notifications</span>
                  </span> */}
                </Link>
              </li>
              <li className="px-3">
                <Link
                  to="/products"
                  className="flex items-center gap-3 rounded p-3 transition-colors focus:text-emerald-500 text-white hover:text-emerald-500"
                >
                  <div className="flex items-center self-center ">
                    <MdOutlineProductionQuantityLimits size={22} />
                  </div>
                  <div className="flex w-full flex-1 font-light tracking-wider flex-col items-start justify-center gap-0 overflow-hidden truncate text-sm">
                    Products
                  </div>
                </Link>
              </li>
              <li className="px-3">
                <Link
                  to="/stocks"
                  className="flex items-center gap-3 rounded p-3 transition-colors focus:text-emerald-500 text-white hover:text-emerald-500"
                >
                  <div className="flex items-center self-center ">
                    <PiWarehouseLight size={24} />
                  </div>
                  <div className="flex w-full flex-1 font-light tracking-wider flex-col items-start justify-center gap-0 overflow-hidden truncate text-sm">
                    Stocks
                  </div>
                </Link>
              </li>
              <li className="px-3">
                <Link
                  to="/purchase"
                  className="flex items-center gap-3 rounded p-3 transition-colors focus:text-emerald-500 text-white hover:text-emerald-500"
                >
                  <div className="flex items-center self-center ">
                    <FaTag size={20} />
                  </div>
                  <div className="flex w-full flex-1 font-light tracking-wider flex-col items-start justify-center gap-0 overflow-hidden truncate text-sm">
                    Purchase
                  </div>
                </Link>
              </li>
              <li className="px-3">
                <Link
                  to="/sales"
                  className="flex items-center gap-3 rounded p-3 transition-colors focus:text-emerald-500 text-white hover:text-emerald-500"
                >
                  <div className="flex items-center self-center ">
                    <MdOutlineCurrencyExchange size={22} />
                  </div>
                  <div className="flex w-full flex-1 font-light tracking-wider flex-col items-start justify-center gap-0 overflow-hidden truncate text-sm">
                    Sales
                  </div>
                </Link>
              </li>
              <li className="px-3">
                <Link
                  to="/reports"
                  className="flex items-center gap-3 rounded p-3 transition-colors focus:text-emerald-500 text-white hover:text-emerald-500"
                >
                  <div className="flex items-center self-center ">
                    <BiSolidReport size={20} />
                  </div>
                  <div className="flex w-full flex-1 font-light tracking-wider flex-col items-start justify-center gap-0 overflow-hidden truncate text-sm">
                    Reports
                  </div>
                </Link>
              </li>
              <li className="px-3">
                <Link
                  to="/profile"
                  className="flex items-center gap-3 rounded p-3 transition-colors focus:text-emerald-500 text-white hover:text-emerald-500"
                >
                  <div className="flex items-center self-center ">
                    <IoIosSettings size={20} />
                  </div>
                  <div className="flex w-full flex-1 font-light tracking-wider flex-col items-start justify-center gap-0 overflow-hidden truncate text-sm">
                    Settings
                  </div>
                </Link>
              </li>
              <li className="px-3">
                <Link
                  to="/order"
                  className="flex items-center gap-3 rounded p-3 transition-colors focus:text-emerald-500 text-white hover:text-emerald-500"
                >
                  <div className="flex items-center self-center ">
                    <FaShopify size={20} />
                  </div>
                  <div className="flex w-full flex-1 font-light tracking-wider flex-col items-start justify-center gap-0 overflow-hidden truncate text-sm">
                    Orders
                  </div>
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <footer className="px-3 py-2">
          {user ? (
            <div>
              <Tooltip title="Logout">
                <button
                  onClick={handleLogout}
                  href="#"
                  className="text-gray-600 font-bold"
                >
                  <Link
                    to="#"
                    className="flex items-center gap-3 rounded p-3 text-white transition-colors hover:text-emerald-500 "
                  >
                    <div className="flex items-center self-center ">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="h-6 w-6"
                        aria-label="Dashboard icon"
                        role="graphics-symbol"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11.25 9l-3 3m0 0l3 3m-3-3h7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="flex w-full flex-1 font-light tracking-wider flex-col items-start justify-center gap-0 overflow-hidden truncate text-sm">
                      Logout
                    </div>
                  </Link>
                </button>
              </Tooltip>{" "}
            </div>
          ) : (
            <LoginScreen />
          )}
        </footer>
      </aside>

      {/* <div
        className={`fixed top-0 bottom-0 left-0 right-0 z-30 bg-slate-900/20 transition-colors sm:hidden ${
          isSideNavOpen ? "block" : "hidden"
        }`}
        onClick={() => setIsSideNavOpen(false)}
      ></div> */}
      <div
        className={`fixed top-0 bottom-0 left-0 right-0 z-30 bg-slate-900/20 transition-colors sm:hidden ${
          isSideNavOpen ? "block" : "hidden"
        }`}
        onClick={() => setIsSideNavOpen(false)}
      ></div>
    </>
  );
}

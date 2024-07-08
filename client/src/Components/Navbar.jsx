import React, { useEffect } from "react";
import { IoNotifications } from "react-icons/io5";
import { IoIosLogOut, IoIosSettings } from "react-icons/io";
import { Tooltip } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, logOutAdmin } from "../features/authSlice";
import toast from "react-hot-toast";
import LoginScreen from "../Pages/Admin/LoginScreen";

const Navbar = () => {
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

  return (
    <header>
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 bg-gray-200 w-full font-poppins">
        <div className="flex py-4 items-center justify-end">
          <div className="flex items-center justify-end gap-4">
            <div className="sm:flex sm:gap-4 space-x-6 flex justify-end">
              <a href="#" className="text-gray-600">
                <IoNotifications size={22} />
              </a>
              <div className="hidden sm:flex">
                <a href="#" className="text-gray-600">
                  <Tooltip title="Admin Profile">
                    <IoIosSettings size={22} />
                  </Tooltip>
                </a>
              </div>
              <div className="hidden sm:flex">
                {user ? (
                  <div>
                    <Tooltip title="Logout">
                      <button
                        onClick={handleLogout}
                        href="#"
                        className="text-gray-600 font-bold"
                      >
                        <IoIosLogOut size={22} />{" "}
                      </button>
                    </Tooltip>{" "}
                  </div>
                ) : (
                  <LoginScreen />
                )}
              </div>
            </div>
            <div className="block md:hidden">
              <button className="rounded bg-gray-100 p-2 text-gray-600 transition hover:text-gray-600/75">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

import React, { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import { IoNotifications } from "react-icons/io5";
import { IoIosSettings } from "react-icons/io";
import { Tooltip } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { Dropdown, Space, Badge } from "antd";
import alert from "../assets/alert.gif";
import warn from "../assets/warning01.gif";
import recycle from "../assets/recycle01.gif";
import { ImProfile } from "react-icons/im";
import { TbLogout2 } from "react-icons/tb";
import "../App.css";
import { jwtDecode } from "jwt-decode";
import { logout, logOutAdmin } from "../features/authSlice";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import LoginScreen from "../Pages/Admin/LoginScreen";

const socket = io("http://localhost:5000");

const Navbar = () => {
  const [notifications, setNotifications] = useState([]);
  const [animate, setAnimate] = useState(false);
  const notificationCount = notifications.length;
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const baseUrl = "http://localhost:5000/public/profile";

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
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000; 
        const expTime = decodedToken.exp;
  
        if (expTime && expTime > currentTime) {
          const expiryTime = (expTime - currentTime) * 1000;
  
          if (expiryTime > 0) {
            const timer = setTimeout(() => {
              dispatch(logout());
            }, expiryTime);
  
            return () => clearTimeout(timer);
          }
        } else {
          dispatch(logout());
        }
      } catch (error) {
        console.error("Invalid token:", error);
        dispatch(logout());
      }
    } else {
      dispatch(logout());
    }
  }, [dispatch]);
  

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const lowStockResponse = await axios.get(
          "http://localhost:5000/api/v1/notification/low-stock"
        );

        const lowStockNotifications = lowStockResponse.data.data.map(
          (product) => {
            let type;
            if (product.totalQuantity == 0) {
              type = "outOfStock";
            } else if (product.totalQuantity <= 10) {
              type = "lowStock";
            } else if (
              product.totalQuantity > 10 &&
              product.totalQuantity <= product.reOrderLevel
            ) {
              type = "reOrder";
            }
            return {
              message: product.message,
              type,
            };
          }
        );
        setNotifications([...lowStockNotifications]);
        setAnimate(true);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    const handleLowStockUpdate = (lowStockProducts) => {
      console.log("Low stock update received:", lowStockProducts);
      const newNotifications = lowStockProducts.data.map((product) => {
        let type;
        if (product.totalQuantity == 0) {
          type = "outOfStock";
        } else if (product.totalQuantity <= 10) {
          type = "lowStock";
        } else if (
          product.totalQuantity > 10 &&
          product.totalQuantity <= product.reOrderLevel
        ) {
          type = "reOrder";
        }
        return {
          message: product.message,
          type,
        };
      });
      setNotifications(newNotifications);
      setAnimate(true);
    };

    fetchNotifications();

    socket.on("lowStockUpdated", handleLowStockUpdate);

    return () => {
      socket.off("lowStockUpdated", handleLowStockUpdate);
    };
  }, []);

  useEffect(() => {
    if (notificationCount > 0) {
      setAnimate(true);
    }
  }, [notificationCount]);

  useEffect(() => {
    console.log("Notifications state updated:", notifications);
    const timer = setTimeout(() => {
      setAnimate(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [notifications]);

  const items = notifications.map((notification, index) => {
    let iconSrc;
    let iconAlt;
    let className;

    switch (notification.type) {
      case "lowStock":
        iconSrc = alert;
        iconAlt = "Low Stock";
        className = "low-stock";
        break;
      case "outOfStock":
        iconSrc = warn;
        iconAlt = "Out of Stock";
        className = "out-of-stock";
        break;
      case "reOrder":
        iconSrc = recycle;
        iconAlt = "Reorder";
        className = "reorder";
        break;
    }

    return {
      key: index,
      label: (
        <div
          className={`flex flex-row ${className} font-serif`}
          style={{ padding: "8px", borderRadius: "5px" }}
        >
          <img
            src={iconSrc}
            alt={iconAlt}
            className="rounded-full"
            style={{ width: 28, marginRight: 7 }}
          />
          {notification.message}
        </div>
      ),
    };
  });

  return (
    <header>
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 bg-gray-200 w-full font-poppins">
        <div className="flex pt-4 items-center justify-end">
          <div className="flex items-center justify-end gap-4">
            <div className="sm:flex sm:gap-4 space-x-6 flex justify-end">
              <Badge
                count={notificationCount}
                overflowCount={99}
                className="mt-3"
              >
                <Dropdown
                  menu={{
                    items,
                  }}
                  overlayClassName="h-60 overflow-auto"
                >
                  <a onClick={(e) => e.preventDefault()}>
                    <Space className={animate ? "bell" : ""}>
                      <IoNotifications size={22} className="text-sky-800" />
                    </Space>
                  </a>
                </Dropdown>
              </Badge>

              {user ? (
                <div className="dropdown dropdown-end">
                  <div tabIndex={0} role="button" className="text-black">
                    <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-white">
                      <img
                        src={`${baseUrl}/${user.profileImage}`}
                        alt="user name"
                        title="user name"
                        width="80"
                        height="80"
                        className="max-w-full rounded-full"
                      />
                    </span>
                  </div>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu bg-gray-50 rounded-md z-[1] w-52 shadow"
                  >
                    <li className="px-3">
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 rounded"
                      >
                        <div className="flex items-center self-center ">
                          <ImProfile size={20} />
                        </div>
                        <div className="flex w-full flex-1 text-md font-normal text-gray-600 tracking-wider flex-col items-start justify-center gap-0 overflow-hidden truncate">
                          Profile
                        </div>
                      </Link>
                    </li>
                    <li className="px-3">
                      <div>
                        <button
                          onClick={handleLogout}
                          href="#"
                          className="text-gray-600 font-bold"
                        >
                          <Link
                            to="#"
                            className="flex items-center gap-2 rounded "
                          >
                            <div className="flex items-center self-center ">
                              <TbLogout2 size={20} />
                            </div>
                            <div className="flex w-full flex-1 text-md font-normal text-gray-600 tracking-wider flex-col items-start justify-center gap-0 overflow-hidden truncate">
                              Logout
                            </div>
                          </Link>
                        </button>
                      </div>
                    </li>
                  </ul>
                </div>
              ) : (
                <LoginScreen />
              )}
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

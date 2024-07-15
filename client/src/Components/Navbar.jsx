import React, { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import { IoNotifications } from "react-icons/io5";
import { IoIosSettings } from "react-icons/io";
import { Tooltip } from "antd";
import { Link } from "react-router-dom";
import { Dropdown, Space, Badge } from "antd";
import warn from "../assets/warn.png";
import error from "../assets/error.png";
import "../App.css";

const socket = io("http://localhost:5000");

const Navbar = () => {
  const [notifications, setNotifications] = useState([]);
  const [animate, setAnimate] = useState(false);
  const notificationCount = notifications.length;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const lowStockResponse = await axios.get(
          "http://localhost:5000/api/v1/notification/low-stock"
        );


        const lowStockNotifications = lowStockResponse.data.data.map(
          (product) => {
            const type = product.totalQuantity == 0 ? "outOfStock" : "lowStock";
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
      const newNotifications = lowStockProducts.data.map((product) =>  {
        const type = product.totalQuantity == 0 ? "outOfStock" : "lowStock"; 
        console.log("hell",type);
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

  const items = notifications.map((notification, index) => ({
    key: index,
    label: (
      <div>
        {notification.type == "lowStock" ? (
          <img
            src={warn}
            alt="Low Stock"
            style={{ width: 20, marginRight: 10 }}
          />
        ) : (
          <img
            src={error}
            alt="Out of Stock"
            style={{ width: 20, marginRight: 10 }}
          />
        )}
        {notification.message}
      </div>
    ),
  }));

  return (
    <header>
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 bg-gray-200 w-full font-poppins">
        <div className="flex pt-4 items-center justify-end">
          <div className="flex items-center justify-end gap-4">
            <div className="sm:flex sm:gap-4 space-x-6 flex justify-end">
              <Badge count={notificationCount} overflowCount={99}>
                <Dropdown
                  menu={{
                    items,
                  }}
                  overlayClassName="h-40 overflow-auto"
                >
                  <a onClick={(e) => e.preventDefault()}>
                    <Space className={animate ? "bell" : ""}>
                      <IoNotifications size={22} />
                    </Space>
                  </a>
                </Dropdown>
              </Badge>
              <div className="hidden sm:flex">
                <Link to="/profile" className="text-gray-600">
                  <Tooltip title="Admin Profile">
                    <IoIosSettings size={22} />
                  </Tooltip>
                </Link>
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

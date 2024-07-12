import React, { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import warn from "../assets/warn.png";
import error from "../assets/error.png";

const Notification = () => {
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const lowStockResponse = await axios.get(
          "http://localhost:5000/api/v1/notification/low-stock"
        );
        const lowStockProducts = lowStockResponse.data.data;

        lowStockProducts.forEach((product, index) => {
          setTimeout(() => {
            toast.custom(
              (t) => (
                <div
                  className={`${
                    t.visible ? "animate-enter" : "animate-leave"
                  } max-w-md w-full bg-yellow-50 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
                >
                  <div className="flex-1 w-0 p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 pt-0.5">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={warn}
                          alt="Warning"
                        />
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          Low Quantity
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          {product.message}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex border-l border-gray-200">
                    <button
                      onClick={() => toast.dismiss(t.id)}
                      className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-yellow-600 hover:text-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ),
              {
                duration: 3000,
                position: "top-right",
              }
            );
          }, index * 3000);
        });

        const outOfStockResponse = await axios.get(
          "http://localhost:5000/api/v1/notification/out-of-stock"
        );
        const outOfStockProducts = outOfStockResponse.data.data;

        outOfStockProducts.forEach((product, index) => {
          setTimeout(() => {
            toast.custom(
              (t) => (
                <div
                  className={`${
                    t.visible ? "animate-enter" : "animate-leave"
                  } max-w-md w-full bg-red-50 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
                >
                  <div className="flex-1 w-0 p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 pt-0.5">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={error}
                          alt="Error"
                        />
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          Out of Stock
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          {product.message}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex border-l border-gray-200">
                    <button
                      onClick={() => toast.dismiss(t.id)}
                      className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-red-600 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ),
              {
                duration: 3000,
                position: "top-right",
              }
            );
          }, index * 3000);
        });
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
    const intervalId = setInterval(fetchNotifications, 7200000);

    return () => clearInterval(intervalId);
  }, []);

  return <Toaster />;
};

export default Notification;

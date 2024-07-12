/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import logo from "../assets/notification.png";
import axios from "axios";

const Notification = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/v1/product/list"
        );
        setProducts(response.data);
        console.log("Products: ", response.data);

        products.forEach((product) => {
          const { productName, totalQuantity } = product;

          if (totalQuantity === 0) {
            toast.custom(
              (t) => (
                <div
                  className={`${
                    t.visible ? "animate-enter" : "animate-leave"
                  } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
                >
                  <div className="flex-1 w-0 p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 pt-0.5">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={logo}
                          alt="logo"
                        />
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          Out of Stock
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          The product `${productName}` is out of stock.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex border-l border-gray-200">
                    <button
                      onClick={() => toast.dismiss(t.id)}
                      className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ),
              {
                duration: 5000,
                position: "top-right",
              }
            );
          } else if (totalQuantity <= 10) {
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
                          src={logo}
                          alt="logo"
                        />
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          Low Quantity
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          The product `{productName}`` has low stock (only{" "}
                          {totalQuantity} left).
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
                duration: 5000,
                position: "top-right",
              }
            );
          }
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Toaster />
    </div>
  );
};

export default Notification;

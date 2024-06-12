import React from "react";
import { SiPowerapps } from "react-icons/si";
import { Link } from "react-router-dom";
import { AiOutlineDashboard } from "react-icons/ai";
import { BiCategoryAlt } from "react-icons/bi";
import { FaTag } from "react-icons/fa6";
import { RiStockFill } from "react-icons/ri";
import { FcSalesPerformance } from "react-icons/fc";
import { BiSolidReport } from "react-icons/bi";
import { MdNotificationsActive } from "react-icons/md";
import { IoIosSettings } from "react-icons/io";

const Sidebar = () => {
  return (
    <div className="flex h-screen w-64 px-4 flex-col justify-between border-e text-white font-poppins bg-primaryDefault">
      <div className="px-4 py-6 ">
        <span className="flex flex-row items-center justify-start py-5 mb-10 w-full place-content-center rounded-lg text-3xl font-acme font-medium tracking-widest">
          <SiPowerapps className="mr-2 text-primaryRed" />
          <span className=" text-primaryRed">Power</span> <span>Pixel</span>
        </span>

        <div>
          <ul className=" space-y-8">
            <li className="flex text-base font-light items-center gap-2 text-gray-300">
              <AiOutlineDashboard />
              <Link to="/">Dashboard</Link>
            </li>
            <li className="flex text-base font-light items-center gap-2 text-gray-300">
              <BiCategoryAlt />
              <Link to="/category">Categories</Link>
            </li>
            <li className="flex text-base font-light items-center gap-2 text-gray-300">
              <FaTag />
              <Link to="/products">Products</Link>
            </li>
            <li className="flex text-base font-light items-center gap-2 text-gray-300">
              <RiStockFill />
              <Link to="/stocks">Stocks</Link>
            </li>
            <li className="flex text-base font-light items-center gap-2 text-gray-300">
              <FaTag />
              <Link to="/purchase">Purchase</Link>
            </li>
            <li className="flex text-base font-light items-center gap-2 text-gray-300">
              <FcSalesPerformance />
              <Link to="/sales">Sales</Link>
            </li>
            <li className="flex text-base font-light items-center gap-2 text-gray-300">
              <BiSolidReport />
              <Link to="/reports">Reports</Link>
            </li>
            <li className="flex text-base font-light items-center gap-2 text-gray-300">
              <MdNotificationsActive />
              <Link to="/notification">Notifications</Link>
            </li>
            <li className="flex text-base font-light items-center gap-2 text-gray-300">
              <IoIosSettings />
              <Link to="/dashboard">Settings</Link>
            </li>

            <li className="flex text-base font-light items-center gap-2 text-gray-300">
              <Link to="/dashboard"></Link>
            </li>
          </ul>
        </div>

        {/* <ul className="mt-6 space-y-1">
          <li>
            <a
              href="#"
              className="block rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700"
            >
              Dashboard
            </a>
          </li>

          <li>
            <details className="group [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                <span className="text-sm font-medium"> Teams </span>

                <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </summary>

              <ul className="mt-2 space-y-1 px-4">
                <li>
                  <a
                    href="#"
                    className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                  >
                    Banned Users
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                  >
                    Calendar
                  </a>
                </li>
              </ul>
            </details>
          </li>

          <li>
            <a
              href="#"
              className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            >
              Billing
            </a>
          </li>

          <li>
            <a
              href="#"
              className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            >
              Invoices
            </a>
          </li>

          <li>
            <details className="group [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                <span className="text-sm font-medium"> Account </span>

                <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </summary>

              <ul className="mt-2 space-y-1 px-4">
                <li>
                  <a
                    href="#"
                    className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                  >
                    Details
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                  >
                    Security
                  </a>
                </li>

                <li>
                  <form action="#">
                    <button
                      type="submit"
                      className="w-full rounded-lg px-4 py-2 text-sm font-medium text-gray-500 [text-align:_inherit] hover:bg-gray-100 hover:text-gray-700"
                    >
                      Logout
                    </button>
                  </form>
                </li>
              </ul>
            </details>
          </li>
        </ul> */}
      </div>
    </div>
  );
};

export default Sidebar;

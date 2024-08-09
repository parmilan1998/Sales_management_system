import React, { useEffect, useState } from "react";
import { SiPowerapps } from "react-icons/si";
import { Link, useNavigate } from "react-router-dom";
import { FcCurrencyExchange } from "react-icons/fc";
import axios from "axios";
import LoginScreen from "../Pages/Admin/LoginScreen";
import { TbLogout2 } from "react-icons/tb";
import { ImProfile } from "react-icons/im";
import { useDispatch, useSelector } from "react-redux";
import { logout, logOutAdmin } from "../features/authSlice";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
const apiUrl = import.meta.env.VITE_API_BASE_URL;

export default function NavbarSales() {
  const [isToggleOpen, setIsToggleOpen] = useState(false);
  const [salesCount, setSalesCount] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const baseUrl = `${apiUrl}/public/profile`;

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
  // Fetch Sales Count
  const fetchSalesCount = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/v1/sales/list`);
      console.log(res.data);
      setSalesCount(res.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    fetchSalesCount();
  }, []);

  return (
    <>
      {/*<!-- Header --> */}
      <header className="border-b-1 font-poppins relative z-20 w-full border-b border-slate-200 bg-primary shadow-lg shadow-slate-700/5 after:absolute after:left-0 after:top-full after:z-10 after:block after:h-px after:w-full after:bg-slate-200 lg:border-slate-200 lg:backdrop-blur-sm lg:after:hidden">
        <div className="relative mx-auto max-w-full px-6 lg:max-w-5xl xl:max-w-7xl 2xl:max-w-[96rem]">
          <nav
            aria-label="main navigation"
            className="flex h-16 items-stretch justify-between font-medium text-slate-700"
            role="navigation"
          >
            {/*      <!-- Brand logo --> */}
            <Link to="/" className="flex items-center">
              <span className="flex flex-row items-center justify-start w-full place-content-center rounded-lg text-3xl font-acme font-bold tracking-widest">
                <SiPowerapps className="mr-2 text-primaryRed" />
                <span className=" text-primaryRed">Vital</span>{" "}
                <span className="text-white">Mart</span>
              </span>
            </Link>
            {/*      <!-- Mobile trigger --> */}
            <button
              className={`relative order-10 block h-10 w-10 self-center lg:hidden
                ${
                  isToggleOpen
                    ? "visible opacity-100 [&_span:nth-child(1)]:w-6 [&_span:nth-child(1)]:translate-y-0 [&_span:nth-child(1)]:rotate-45 [&_span:nth-child(2)]:-rotate-45 [&_span:nth-child(3)]:w-0 "
                    : ""
                }
              `}
              onClick={() => setIsToggleOpen(!isToggleOpen)}
              aria-expanded={isToggleOpen ? "true" : "false"}
              aria-label="Toggle navigation"
            >
              <div className="absolute left-1/2 top-1/2 w-6 -translate-x-1/2 -translate-y-1/2 transform">
                <span
                  aria-hidden="true"
                  className="absolute block h-0.5 w-9/12 -translate-y-2 transform rounded-full bg-slate-900 transition-all duration-300"
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
            {/*      <!-- Navigation links --> */}
            <ul
              role="menubar"
              aria-label="Select page"
              className={`absolute left-0 top-0 z-[-1] h-[28.5rem] w-full justify-center overflow-hidden  overflow-y-auto overscroll-contain bg-white/90 px-8 pb-12 pt-24 font-medium transition-[opacity,visibility] duration-300 lg:visible lg:relative lg:top-0  lg:z-0 lg:flex lg:h-full lg:w-auto lg:items-stretch lg:overflow-visible lg:bg-white/0 lg:px-0 lg:py-0  lg:pt-0 lg:opacity-100 ${
                isToggleOpen
                  ? "visible opacity-100 backdrop-blur-sm"
                  : "invisible opacity-0"
              }`}
            >
              {/* <li role="none" className="ml-2 flex items-stretch">
                <Link
                  to="/invoice"
                  role="menuitem"
                  aria-current="page"
                  aria-haspopup="false"
                  className="flex items-center gap-1 py-4 text-white transition-colors duration-300 hover:text-gray-400 focus:text-white focus:outline-none focus-visible:outline-none lg:px-8"
                >
                  <span> Add New Sale</span>
                </Link>
              </li> */}
              {/* <li role="none" className="flex items-stretch">
                <Link
                  to="/invoice/add"
                  role="menuitem"
                  aria-current="page"
                  aria-haspopup="false"
                  className="flex items-center gap-1 py-4 text-white transition-colors duration-300 hover:text-gray-400 focus:text-white focus:outline-none focus-visible:outline-none lg:px-8"
                >
                  <span> Add Invoice</span>
                </Link>
              </li> */}
            </ul>
            {/*      <!-- Actions --> */}
            <div className="ml-auto flex gap-5 items-center justify-end px-6 lg:ml-0 lg:flex-1 lg:p-0">
              {/* <a
                href="#"
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-lg text-emerald-500"
              >
                <FcCurrencyExchange size={24} />

                <span className="absolute -right-2 -top-1.5 inline-flex items-center justify-center gap-1 rounded-full border-2 border-white bg-pink-500 px-1.5 py-1 text-xs text-white">
                  {salesCount.count}
                  <span className="sr-only"> new emails </span>
                </span>
              </a> */}
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
          </nav>
        </div>
      </header>
    </>
  );
}

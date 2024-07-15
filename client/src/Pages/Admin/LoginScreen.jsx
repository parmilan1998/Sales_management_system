import React from "react";
import { AiFillDropboxCircle } from "react-icons/ai";
import { MdPlayArrow } from "react-icons/md";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login, loginAdmin } from "../../features/authSlice";
import GoogleSignInButton from "../../Components/admin/GoogleSignIn";

const LoginScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  // Login User
  const onSubmit = async (data) => {
    try {
      const result = await dispatch(loginAdmin(data));
      if (loginAdmin.fulfilled.match(result)) {
        dispatch(login(result.payload));
        toast.success("Login Successfully!..");
        reset();
        navigate("/");
      } else {
        toast.error("Invalid credentials. Please try again.");
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <div className="flex lg:flex-row flex-col w-full h-screen">
      <div className=" bg-primaryDefault text-white lg:w-[46%] py-5 w-full lg:rounded-r-[50px] flex justify-center items-center text-center flex-col space-y-14 relative">
        <div className="">
          <h1 className="text-2xl text-white font-poppins font-normal">
            Hello
          </h1>
          <h2 className="text-3xl text-white font-poppins font-medium">
            Welcome to!
          </h2>
        </div>
        <div className="flex flex-col text-white">
          <div className="pl-2">
            <AiFillDropboxCircle color="white" size={90} />
          </div>
          <h2 className="text-2xl text-center text-white font-poppins font-medium">
            VitalMart
          </h2>
        </div>
        <div>
          <p className="px-16 text-md font-poppins font-light tracking-wider leading-8">
            At VitalMart, we’re dedicated to bringing you the best in fresh
            groceries. Explore our wide selection of quality products and enjoy
            a shopping experience that supports your well-being. Freshness
            starts here!
          </p>
        </div>
        <div className="flex flex-row text-lg item-center justify-center font-poppins">
          <h1>SIGN IN</h1>
          <MdPlayArrow size={28} />
        </div>
      </div>
      <div className="absolute bg-white rounded-3xl h-[450px] w-16 top-[18%] left-[44%] lg:flex hidden"></div>
      <div className="flex lg:w-[54%] py-12 w-full items-center flex-col font-poppins">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1 className="lg:text-3xl tracking-wide text-gray-500 text-base font-acme font-medium text-center py-8">
            Login your account
          </h1>
          <div className="flex flex-col mb-6 space-y-3">
            <label htmlFor="email" className="text-lg">
              Email Address
            </label>
            <input
              {...register("email", { required: "Email address is required" })}
              name="email"
              type="text"
              placeholder="ex - admininfo@gmail.com"
              className="px-3  py-2.5 border-gray-200 border lg:w-[550px] md:w-[450px] rounded-md focus:outline-cyan-500"
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="flex flex-col mb-8 space-y-3">
            <label htmlFor="password" className="text-lg">
              Password
            </label>
            <input
              {...register("password", { required: "password is required" })}
              name="password"
              type="password"
              placeholder="ex - password"
              className="px-3 py-2.5 border-gray-200 border lg:w-[550px] rounded-md focus:outline-cyan-500"
            />
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>
          <div className="flex flex-col mb-6">
            <button className="text-white bg-primaryDefault rounded py-2.5">
              Log In
            </button>
          </div>
          <div>
            <span className="relative flex justify-center">
              <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-transparent bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-75"></div>

              <span className="relative z-10 bg-white px-6 font-poppins text-gray-500">
                Or,
              </span>
            </span>
          </div>
        </form>
        <GoogleSignInButton />
      </div>
    </div>
  );
};

export default LoginScreen;

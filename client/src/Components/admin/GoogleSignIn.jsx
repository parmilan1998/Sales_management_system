/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import googleLogo from "../../assets/google.png";
import { auth, provider } from "./config";
import { signInWithPopup } from "firebase/auth";
import Dashboard from "../../Pages/Dashboard";
import { useNavigate } from "react-router-dom";
import { login } from "../../features/authSlice";
import { useDispatch } from "react-redux";

const GoogleSignInButton = () => {
  const [value, setValue] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClick = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        setValue(user.email);
        dispatch(login({ email: user.email }));
        localStorage.setItem("email", user.email);
        navigate("/");
      })
      .catch((error) => {
        console.log({ error });
      });
  };

  console.log({ value });

  return (
    <div>
      <div className="flex justify-center py-8 font-poppins">
        {value ? (
          <Dashboard />
        ) : (
          <button
            onClick={handleClick}
            className="font-poppins gap-1 border w-full rounded-md flex justify-center py-2 lg:px-44 border-gray-400"
          >
            <img
              src={googleLogo}
              alt="Google Logo"
              className="w-6 h-6 object-fill"
            />
            SignIn with google
          </button>
        )}
      </div>
    </div>
  );
};

export default GoogleSignInButton;

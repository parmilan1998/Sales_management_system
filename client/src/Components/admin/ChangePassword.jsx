/* eslint-disable react/prop-types */
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";

const ChangePassword = ({ setIsModalOpen }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    if (!newPassword || !confirmPassword || !currentPassword) {
      toast.error("Passwords can't be empty");
      return;
    }
    const token = localStorage.getItem("token");

    try {
      const response = await axios.put(
        "http://localhost:5000/api/v1/user/change-password",
        {
          currentPassword,
          newPassword,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err.response.data.error);
    }
  };

  const handleClear = (e) => {
    e.preventDefault();
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div>
      <form>
        <div className="relative my-6">
          <input
            id="current_password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            name="current_password"
            placeholder="your name"
            className="relative w-full h-10 px-4 text-sm placeholder-transparent transition-all border rounded outline-none focus-visible:outline-none peer border-slate-200 text-slate-500 autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-emerald-500 focus:outline-none invalid:focus:border-pink-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
          />
          <label
            htmlFor="current_password"
            className="cursor-text peer-focus:cursor-default peer-autofill:-top-2 absolute left-2 -top-2 z-[1] px-2 text-xs text-slate-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-required:after:text-pink-500 peer-required:after:content-['\00a0*'] peer-invalid:text-pink-500 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-emerald-500 peer-invalid:peer-focus:text-pink-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
          >
            Current Password
          </label>
        </div>

        <div className="relative my-6">
          <input
            id="new_password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            name="new_password"
            placeholder="your name"
            className="relative w-full h-10 px-4 text-sm placeholder-transparent transition-all border rounded outline-none focus-visible:outline-none peer border-slate-200 text-slate-500 autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-emerald-500 focus:outline-none invalid:focus:border-pink-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
          />
          <label
            htmlFor="new_password"
            className="cursor-text peer-focus:cursor-default peer-autofill:-top-2 absolute left-2 -top-2 z-[1] px-2 text-xs text-slate-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-required:after:text-pink-500 peer-required:after:content-['\00a0*'] peer-invalid:text-pink-500 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-emerald-500 peer-invalid:peer-focus:text-pink-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
          >
            New Password
          </label>
        </div>
        <div className="relative my-6">
          <input
            id="confirm_password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            name="confirm_password"
            placeholder="your name"
            className="relative w-full h-10 px-4 text-sm placeholder-transparent transition-all border rounded outline-none focus-visible:outline-none peer border-slate-200 text-slate-500 autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-emerald-500 focus:outline-none invalid:focus:border-pink-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
          />
          <label
            htmlFor="confirm_password"
            className="cursor-text peer-focus:cursor-default peer-autofill:-top-2 absolute left-2 -top-2 z-[1] px-2 text-xs text-slate-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-required:after:text-pink-500 peer-required:after:content-['\00a0*'] peer-invalid:text-pink-500 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-emerald-500 peer-invalid:peer-focus:text-pink-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
          >
            Current Password
          </label>
        </div>
        <div className="relative my-6 flex flex-row gap-2">
          <button
            onClick={handleClear}
            className="text-base bg-sky-500 hover:bg-sky-700 w-full px-4 py-2 rounded-md text-white"
          >
            Clear
          </button>
          <button
            onClick={handleUpdatePassword}
            className="text-base bg-emerald-500 hover:bg-emerald-700 w-full px-4 py-2 rounded-md text-white"
          >
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;

import { Button, Modal } from "antd";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import ChangePassword from "../Components/ChangePassword";

const ProfileSettingsScreen = () => {
  const user = useSelector((state) => state.auth.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <div className=" max-w-screen-xl mx-auto lg:px-8 font-poppins">
      <h1 className="text-3xl text-center font-medium py-8 text-cyan-600">
        Admin Profile
      </h1>
      <div className="overflow-hidden rounded w-96 mx-auto bg-gray-300 text-center text-slate-500">
        <figure className="p-6 pb-0">
          <span className="relative inline-flex h-20 w-20 items-center justify-center rounded-full text-white">
            <img
              src="https://i.pravatar.cc/80?img=22"
              alt="user name"
              title="user name"
              width="80"
              height="80"
              className="max-w-full rounded-full"
            />
          </span>
        </figure>
        {/*  <!-- Body--> */}
        <div className="p-6">
          <header className="mb-4">
            <h3 className="text-xl font-medium text-slate-700">
              {user.username}
            </h3>
            <p className=" text-slate-400">{user.email}</p>
          </header>
        </div>
        {/*  <!-- Action base sized with lead icon buttons  --> */}
        <div className="flex justify-end gap-2 p-6 pt-0">
          <Button
            onClick={showModal}
            className="h-10 px-5 bg-emerald-500 text-base text-white hover:bg-emerald-800"
          >
            Change Password
          </Button>
          <Modal
            title="Update Changes"
            style={{ textAlign: "center" }}
            open={isModalOpen}
            onCancel={handleCancel}
            footer={null}
          >
            <ChangePassword />
          </Modal>
          <button
            type="submit"
            className="inline-flex h-10 flex-1 items-center justify-center gap-2 justify-self-center whitespace-nowrap rounded bg-emerald-50 px-5 text-sm font-medium tracking-wide text-emerald-500 transition duration-300 hover:bg-emerald-100 hover:text-emerald-600 focus:bg-emerald-200 focus:text-emerald-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-emerald-300 disabled:bg-emerald-100 disabled:text-emerald-400 disabled:shadow-none"
          >
            <span className="order-2">Update Profile</span>
            {/* <span className="relative only:-mx-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
                role="graphics-symbol"
                aria-labelledby="title-21 desc-21"
              >
                <title id="title-21">Icon title</title>
                <desc id="desc-21">
                  A more detailed description of the icon
                </desc>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </span> */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsScreen;

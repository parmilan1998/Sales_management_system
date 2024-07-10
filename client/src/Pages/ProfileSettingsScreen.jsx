/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Modal } from "antd";
import React, { useEffect, useState } from "react";
import ChangePassword from "../Components/admin/ChangePassword";
import UpdateProfile from "../Components/admin/UpdateProfile";
import axios from "axios";

const ProfileSettingsScreen = () => {
  const token = localStorage.getItem("token");
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [user, setUser] = useState([]);

  const showPasswordModal = () => {
    setIsPasswordModalOpen(true);
  };

  const showProfileModal = () => {
    setIsProfileModalOpen(true);
  };

  const handleCancelPassword = () => {
    setIsPasswordModalOpen(false);
  };

  const handleCancelProfile = () => {
    setIsProfileModalOpen(false);
  };

  const fetchDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/v1/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      console.log(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  return (
    <div className="max-w-screen-xl mx-auto lg:px-8 font-poppins">
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
        <div className="p-6">
          <header className="mb-4">
            <h3 className="text-xl font-medium text-slate-700">
              {user.username}
            </h3>
            <p className="text-slate-400">{user.email}</p>
          </header>
        </div>
        <div className="flex justify-end gap-2 p-6 pt-0">
          <Button
            onClick={showPasswordModal}
            className="h-10 px-5 bg-emerald-500 text-base text-white hover:bg-emerald-800"
          >
            Change Password
          </Button>
          <Modal
            title={
              <div className="font-poppins tracking-wide pt-6 text-2xl text-gray-600">
                Change Password
              </div>
            }
            style={{ textAlign: "center" }}
            open={isPasswordModalOpen}
            onCancel={handleCancelPassword}
            footer={null}
          >
            <ChangePassword setIsModalOpen={setIsPasswordModalOpen} />
          </Modal>

          <Button
            onClick={showProfileModal}
            className="inline-flex h-10 flex-1 items-center justify-center gap-2 justify-self-center whitespace-nowrap rounded bg-emerald-50 px-5 text-sm font-medium tracking-wide text-emerald-500 transition duration-300 hover:bg-emerald-100 hover:text-emerald-600 focus:bg-emerald-200 focus:text-emerald-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-emerald-300 disabled:bg-emerald-100 disabled:text-emerald-400 disabled:shadow-none"
          >
            Update Profile
          </Button>
          <Modal
            title={
              <div className="font-poppins tracking-wide pt-6 text-2xl text-gray-600">
                Update Profile
              </div>
            }
            style={{ textAlign: "center" }}
            open={isProfileModalOpen}
            onCancel={handleCancelProfile}
            footer={null}
          >
            <UpdateProfile
              setIsModalOpen={setIsProfileModalOpen}
              user={user}
              fetchDetails={fetchDetails}
            />
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsScreen;

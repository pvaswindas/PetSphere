import React, { useState } from "react";
import SearchBar from "./SearchBar";
import mainLogo from "../../../assets/logo/main-logo.png";
import { useLogout } from "../../../hooks/useLogout";
import notificationIcon from "../../../assets/icon/notification-icon-active.svg";
import saveIcon from "../../../assets/icon/save-icon.svg";
import PostTypeModal from "../post/PostTypeModal";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import userAvatar from "../../../assets/icon/user-avatar.svg"
import NotificationPanel from "./NotificationPanel";
import IncomingCallPanel from "./IncomingCallPanel";

const Navbar = () => {
  const logout = useLogout()
  const navigate = useNavigate()
  const [isModalOpen, setModalOpen] = useState(false)
  const user = useSelector((state) => state.profile.profile_data)

  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false)

  const handleLogout = async () => {
    const response = await logout()

    if (response.success) {
      navigate("/login")
    } else {
      console.log(response.message);
    }
  }

  return (
    <>
      <nav className="w-full bg-white shadow-md flex items-center justify-between lg:px-4 py-1 lg:py-2">
        {/* Start Section */}
        <div className="flex items-center space-x-4">
          {/* Logo */}
          <img src={mainLogo} alt="PetSphere Logo" className="w-[100px] h-[40px]" />
        </div>

        {/* Middle Section */}
        <div className="hidden lg:flex items-center justify-start gap-16 ml-10 sm:ml-20 md:ml-36 w-3/4">
          <SearchBar />
          <div style={{ maxWidth: "240px" }}
            className="flex rounded-full bg-og-gradient p-1">
            <button 
              className="flex-1 bg-white px-5 py-0.5 rounded-full"
              onClick={() => setModalOpen(true)}
            >
              <h1 className="bg-og-gradient font-medium text-md inline-block text-transparent bg-clip-text">
                Add New Post
              </h1>
            </button>
          </div>
        </div>

        {/* End Section */}
        <div className="flex items-center space-x-4 mr-1">
          {/* Notifications Button */}
          <button
            className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200"
            aria-label="Notifications"
            onClick={() => setIsNotificationPanelOpen(!isNotificationPanelOpen)}
          >
            <img src={notificationIcon} alt="Notification" />
          </button>

          {/* Notification Panel */}
          {isNotificationPanelOpen && (
              <NotificationPanel />
          )}
          <IncomingCallPanel />

          {/* Saved Posts Button */}
          {/* <button
            className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200"
            aria-label="Saved Posts"
          >
            <img src={saveIcon} alt="Save" />
          </button> */}

          {/* Profile Dropdown */}
          <div className="relative group">
            {/* Profile Icon */}
            <button
              className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-gray-300 focus:outline-none"
            >
              <img
                src={user?.profile_picture || userAvatar}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </button>

            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-4 w-40 bg-white rounded-lg shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <button
                onClick={handleLogout}
                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Post Type Modal */}
      <PostTypeModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
};

export default Navbar;

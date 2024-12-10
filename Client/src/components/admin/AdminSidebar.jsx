import React from "react"
import symbolLogo from "../../assets/logo/symbol-logo.png"
import { FaHome, FaUser, FaCog, FaChartBar, FaSignOutAlt } from "react-icons/fa"

const AdminSidebar = () => {
    return (
        <div className="h-[650px] w-[80px] bg-deepOceanBlue rounded-3xl flex flex-col items-center p-5">
        {/* Logo */}
        <div className="mb-6">
            <img src={ symbolLogo } alt="petsphere" />
        </div>

        {/* Navigation Icons */}
        <div className="flex-1 flex flex-col items-center space-y-6">
            <button className="text-gray-400 hover:text-white">
            <FaHome size={24} />
            </button>
            <button className="text-gray-400 hover:text-white">
            <FaUser size={24} />
            </button>
            <button className="text-gray-400 hover:text-white">
            <FaChartBar size={24} />
            </button>
            <button className="text-gray-400 hover:text-white">
            <FaCog size={24} />
            </button>
        </div>

        {/* Separator */}
        <hr className="w-10 border-gray-700 mb-4" />

        {/* Logout Icon */}
        <button className="text-gray-400 hover:text-white">
            <FaSignOutAlt size={24} />
        </button>
        </div>
    )
}

export default AdminSidebar

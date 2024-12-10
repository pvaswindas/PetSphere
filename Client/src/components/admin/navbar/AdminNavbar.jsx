import React from "react"
import { FaCalendarAlt, FaBell } from "react-icons/fa"

const AdminNavbar = () => {
    return (
        <div className="w-full flex items-center bg-softSkyBlue p-3 rounded-full shadow-md">
        {/* Search Bar */}
        <div className="flex-1 flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
            <input
            type="text"
            placeholder="Search..."
            className="flex-1 bg-transparent outline-none text-gray-700"
            />
        </div>

        {/* Calendar Icon */}
        <div className="ml-4 flex items-center space-x-2 text-gray-600">
            <FaCalendarAlt size={20} />
            <span>{new Date().toLocaleDateString()}</span>
        </div>

        {/* Notification Icon */}
        <button className="ml-4 text-gray-600 hover:text-gray-800">
            <FaBell size={20} />
        </button>

        {/* Admin Info */}
        <div className="ml-4 flex items-center space-x-2">
            <div className="text-right">
            <p className="text-sm font-medium text-gray-800">Admin Name</p>
            <p className="text-xs text-gray-500">Administrator</p>
            </div>
            {/* Profile Picture */}
            <img
            src="https://via.placeholder.com/40"
            alt="Profile"
            className="w-10 h-10 rounded-full border-2 border-gray-300"
            />
        </div>
        </div>
    )
}

export default AdminNavbar

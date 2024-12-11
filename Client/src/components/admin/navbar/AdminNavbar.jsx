import React from "react"
import { FaCalendarAlt, FaBell } from "react-icons/fa"
import { useSelector } from "react-redux"

const AdminNavbar = () => {
    const admin = useSelector((state) => state.admin.admin_profile)

    return (
        <div className="w-full flex items-center bg-softSkyBlue px-2 py-2 lg:p-3 rounded-full shadow-md">
            {/* Search Bar */}
            <div className="flex items-center w-full lg:w-2/4 bg-white px-4 py-2 rounded-full shadow-sm">
                <input
                    type="text"
                    placeholder="Search..."
                    className="flex-1 bg-transparent outline-none text-gray-700 text-sm lg:text-base"
                />
            </div>

            {/* Other Elements aligned to the right */}
            <div className="ml-auto flex items-center space-x-6">
                {/* Calendar Icon */}
                <div className="hidden lg:flex bg-white py-2 px-4 rounded-lg items-center space-x-2 text-gray-600 text-xs lg:text-base">
                    <FaCalendarAlt size={18} />
                    <span>{new Date().toLocaleDateString()}</span>
                </div>

                {/* Notification Icon */}
                <div className="bg-white p-3 rounded-full items-center ">
                    <button className="hidden lg:flex text-gray-600 hover:text-gray-800">
                        <FaBell size={18} />
                    </button>
                </div>

                {/* Admin Info */}
                <div className="hidden lg:flex items-center space-x-2">
                    <div className="text-right text-xs lg:text-sm">
                        <p className="font-medium text-midnightBlue text-sm">{admin?.user.name || "Admin"}</p>
                        <p className="text-midnightBlue text-xs text-opacity-70">
                            {admin?.user.is_superuser? "Administrator" : "Moderator" || "Staff"}
                        </p>
                    </div>
                    {/* Profile Picture */}
                    <img
                        src="https://via.placeholder.com/40"
                        alt="Profile"
                        className="w-8 h-8 lg:w-10 lg:h-10 rounded-full border-2 border-gray-300"
                    />
                </div>
            </div>
        </div>
    )
}

export default AdminNavbar

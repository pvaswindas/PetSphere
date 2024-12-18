import React from "react"
import { FaCalendarAlt, FaBell } from "react-icons/fa"
import { useSelector } from "react-redux"
import adminAvatar from "../../../assets/admin/admin-avatar.svg"
import { useLogout } from "../../../hooks/useLogout"
import { useNavigate } from "react-router-dom"

const AdminNavbar = () => {
    const admin = useSelector((state) => state.profile.profile_data)

    const navigate = useNavigate()
    const logout = useLogout()

    const handleLogout = async () => {
        const response = await logout()
    
        if (response.success) {
            navigate("/admin/login")
        } else {
            console.log(response.message);
        }
    }

    return (
        <div className="w-full flex items-center bg-softSkyBlue px-2 py-2 lg:p-3 rounded-full shadow-md">
            {/* Search Bar */}
            <div className="flex w-full lg:w-2/4 justify-between">
                <div className="flex items-center w-4/5 lg:w-full bg-white px-4 py-2 rounded-full shadow-sm">
                    <input
                        type="text"
                        id="search"
                        name="search"
                        placeholder="Search..."
                        className="flex-1 bg-transparent w-10 outline-none text-gray-700 text-sm lg:text-base"
                    />
                </div>
                {/* Profile Image - Visible only on smaller screens */}
                <div className="relative group block lg:hidden">
                    <img
                        src={admin?.profile_picture || adminAvatar}
                        alt="Profile"
                        className="w-10 h-10 rounded-full border-2 border-gray-300"
                    />
                    <div className="absolute right-0 mt-4 w-40 bg-white rounded-lg shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        <button
                            className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                        >
                            Profile
                        </button>
                        <button
                            onClick={handleLogout}
                            className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Other Elements aligned to the right */}
            <div className="ml-auto hidden lg:flex items-center space-x-6">
                {/* Calendar Icon */}
                <div className="flex bg-white py-2 px-4 rounded-lg items-center space-x-2 text-gray-600 text-xs lg:text-base">
                    <FaCalendarAlt size={18} />
                    <span>{new Date().toLocaleDateString()}</span>
                </div>

                {/* Notification Icon */}
                <div className="hidden lg:flex bg-white p-3 rounded-full items-center ">
                    <button className="text-gray-600 hover:text-gray-800">
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
                    <div className="relative group">
                        <img
                            src={admin?.profile_picture || adminAvatar}
                            alt="Profile"
                            className="w-8 h-8 lg:w-10 lg:h-10 rounded-full border-2 border-gray-300"
                        />
                        <div className="absolute right-0 mt-4 w-40 bg-white rounded-lg shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                            <button
                                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                            >
                                Profile
                            </button>
                            <button
                                onClick={handleLogout}
                                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminNavbar

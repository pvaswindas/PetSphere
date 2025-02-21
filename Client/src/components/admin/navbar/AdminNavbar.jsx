import React, { useEffect, useState } from "react";
import { FaCalendarAlt, FaBell } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import adminAvatar from "../../../assets/admin/admin-avatar.svg";
import { useLogout } from "../../../hooks/useLogout";
import { useNavigate } from "react-router-dom";
import useDebounce from "../../../hooks/useDebounce";
import { clearAdminSearch, setAdminSearch } from "../../../redux/slices/AdminSearchSlice";
import { X } from "lucide-react";

const AdminNavbar = () => {
    const admin = useSelector((state) => state.profile.profile_data);
    const search = useSelector((state) => state.adminSearch.search);
    const [inputValue, setInputValue] = useState(search || "")
    const navigate = useNavigate();
    const logout = useLogout();

    const dispatch = useDispatch()

    const debouncedSetSearch = useDebounce((value) => {
        dispatch(setAdminSearch(value));
    }, 500);

    useEffect(() => {
        dispatch(clearAdminSearch())
    }, [dispatch])

    const handleChange = (e) => {
        const value = e.target.value;
        setInputValue(value);
        debouncedSetSearch(value);
    };

    const handleClear = () => {
        setInputValue("");
        dispatch(clearAdminSearch());
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/admin/login");
        } catch (error) {
            return;
        }
    };

    return (
        <div className="w-full flex items-center justify-between bg-softSkyBlue p-3 rounded-full shadow-md">
            {/* Container for Search Bar & Profile on small screens */}
            <div className="flex items-center justify-between w-full sm:w-[50%]">
                {/* Search Bar */}
                <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm w-[85%] lg:w-full h-10">
                    <input
                        id="admin-search"
                        name="admin-search"
                        type="text"
                        autoComplete="off"
                        placeholder={search !== "" ? search : "Search..."}
                        value={inputValue}
                        onChange={handleChange}
                        className="flex-1 bg-transparent outline-none text-gray-700 text-sm lg:text-base"
                    />
                    {inputValue && (
                        <X
                            className="w-4 h-4 text-gray-500 cursor-pointer ml-2"
                            onClick={handleClear}
                        />
                    )}
                </div>

                {/* Profile Image - Visible only on smaller screens */}
                <div className="relative group sm:hidden flex-shrink-0 h-10">
                    <img
                        src={admin?.profile_picture || adminAvatar}
                        alt="Profile"
                        className="w-10 h-10 rounded-full border-2 border-gray-300"
                    />
                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        <button className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left">
                            Manage Pets
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
            <div className="sm:flex w-[45%] hidden items-center justify-between">
                {/* Calendar Icon */}
                <div className="flex bg-white py-2 px-3 rounded-lg items-center space-x-2 text-gray-600 text-xs lg:text-base">
                    <FaCalendarAlt size={16} />
                    <span>{new Date().toLocaleDateString()}</span>
                </div>

                {/* Notification Icon */}
                <button className="flex bg-white p-3 rounded-full text-gray-600 hover:text-gray-800">
                    <FaBell size={16} />
                </button>

                {/* Admin Info */}
                <div className="flex items-center space-x-2">
                    <div className="text-right text-xs lg:text-sm">
                        <p className="font-medium text-midnightBlue text-sm">{admin?.user.name || "Admin"}</p>
                        <p className="text-midnightBlue text-xs text-opacity-70">
                            {admin?.user.is_superuser ? "Administrator" : "Moderator" || "Staff"}
                        </p>
                    </div>
                    {/* Profile Picture */}
                    <div className="relative group">
                        <img
                            src={admin?.profile_picture || adminAvatar}
                            alt="Profile"
                            className="w-8 h-8 lg:w-10 lg:h-10 rounded-full border-2 border-gray-300"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminNavbar;

import React from "react"
import symbolLogo from "../../assets/logo/symbol-logo.png"
import { useNavigate } from "react-router-dom"
import { useLogout } from "../../hooks/useLogout"
import { LayoutDashboard, Users, Newspaper, PawPrint, Flag, UserCog, LogOut  } from "lucide-react"

const AdminSidebar = ({ activeIcon }) => {
    const navigate = useNavigate()
    const logout = useLogout()

    const handleLogout = async () => {
        const response = await logout()
        if (response.success) {
            navigate("/admin/login")
        } else {
            localStorage.removeItem("ACCESS_TOKEN")
            localStorage.removeItem("REFRESH_TOKEN")
            navigate("/admin/login")
        }
    }

    const getIconClasses = (icon) =>
        `flex items-center justify-center w-8 h-8 rounded-lg ${
            activeIcon === icon ? "bg-midnightNavy hover:bg-darkDenimBlue p-2" : "p-1"
        }`

    return (
        <div className="h-[650px] w-[80px] bg-deep-ocean-blue-gradient rounded-3xl flex flex-col items-center py-5">
            {/* Logo */}
            <div className="mb-6">
                <img
                    src={symbolLogo}
                    alt="petsphere"
                    className="w-16 transform transition-transform duration-300 hover:scale-[1.3]"
                />
            </div>

            {/* Navigation Icons */}
            <div className="flex-1 flex flex-col items-center space-y-6 text-white">
                <div
                    className={getIconClasses("dashboard")}
                    onClick={() => navigate('/admin')}
                >
                    <LayoutDashboard
                        className="w-4 transform transition-transform duration-300 hover:scale-[1.3]"
                    />
                </div>

                <div
                    className={getIconClasses("manage-users")}
                    onClick={() => navigate('/admin/manage/users')}
                >
                    <Users
                        className="w-4 transform transition-transform duration-300 hover:scale-[1.3]"
                    />
                </div>

                <div
                    className={getIconClasses("manage-pet-type")}
                    onClick={() => navigate('/admin/manage/pets')}
                >
                    <PawPrint
                        className="w-4 transform transition-transform duration-300 hover:scale-[1.3]"
                    />
                </div>

                <div
                    className={getIconClasses("manage-updates")}
                    onClick={() => navigate('/admin/manage/updates')}
                >
                    <Newspaper
                        className="w-4 transform transition-transform duration-300 hover:scale-[1.3]"
                    />
                </div>

                <div
                    className={getIconClasses("manage-reports")}
                >
                    <Flag
                        className="w-4 transform transition-transform duration-300 hover:scale-[1.3]"
                    />
                </div>
                <div
                    className={getIconClasses("admin-profile")}
                >
                    <UserCog
                        className="w-4 transform transition-transform duration-300 hover:scale-[1.3]"
                    />
                </div>
            </div>

            {/* Separator */}
            <hr className="w-12 mb-5" />

            {/* Logout Icon */}
            <button onClick={handleLogout} className="my-5 flex items-center justify-center transform transition-transform duration-300 hover:scale-[1.2]">
                <LogOut className="w-4 text-white" />
            </button>
        </div>
    )
}

export default AdminSidebar

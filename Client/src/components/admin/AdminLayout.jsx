import React from "react"
import WelcomeCard from "./dashboard/WelcomeCard"
import AdminSidebar from "./AdminSidebar"
import AdminNavbar from "./navbar/AdminNavbar"
import InsightCard from "./InsightCard"
import CalendarViewCard from "./CalendarViewCard"

const AdminLayout = ({ activeIcon, setActiveIcon, children, showWelcomeCard }) => {
    return (
        <div className="bg-whiteOpacity05 min-h-screen w-full p-4 lg:p-7 flex">
            {/* Sidebar Section */}
            <div className="hidden lg:block fixed top-0 left-0 h-full m-7">
                <AdminSidebar activeIcon={activeIcon} setActiveIcon={setActiveIcon} />
            </div>

            {/* Main Layout */}
            <div className="flex flex-col w-full lg:w-3/5 lg:ml-[10%] lg:mr-[10%]">
                {/* Navbar */}
                <AdminNavbar />

                {/* Reserved space for WelcomeCard */}
                <div
                    className={`my-2 transition-all duration-300 ${
                        showWelcomeCard ? "block" : "h-0"
                    }`}
                >
                    {showWelcomeCard && <WelcomeCard />}
                </div>

                {/* Content Section */}
                <div>{children}</div>
            </div>

            {/* Right Section */}
            <div className="hidden lg:flex flex-col fixed top-0 right-0 h-full w-[25%] m-7">
                <InsightCard />
                <CalendarViewCard />
            </div>
        </div>
    )
}

export default AdminLayout

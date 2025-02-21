import React from "react"
import WelcomeCard from "./dashboard/WelcomeCard"
import AdminSidebar from "./AdminSidebar"
import AdminNavbar from "./navbar/AdminNavbar"
import InsightCard from "./common/InsightCard"
import CalendarViewCard from "./common/CalendarViewCard"
import AdminBottombar from "./AdminBottombar"

const AdminLayout = ({ activeIcon, children, showWelcomeCard, pageTitle, pageDescription, actionButton, buttonAction=null }) => {
    return (
        <div className="bg-whiteOpacity05 px-4 lg:px-0 min-h-screen w-full flex">
            {/* Sidebar Section */}
            <div className="hidden lg:block fixed top-0 left-0 h-full m-7">
                <AdminSidebar activeIcon={activeIcon} />
            </div>

            {/* Main Layout */}
            <div className="flex flex-col w-full lg:w-3/5 lg:ml-[10%] lg:mr-[10%] h-screen pt-7">
                {/* Navbar */}
                <AdminNavbar />

                {/* Reserved space for WelcomeCard */}
                {showWelcomeCard && (
                    <div className="mt-4 lg:mt-2 transition-all duration-300">
                        <WelcomeCard />
                    </div>
                )}
                {pageTitle && (
                    <div className="flex justify-between px-4 mt-6">
                        <span className="flex flex-col">
                            <h1 className="text-xl lg:text-2xl font-medium text-midnightBlue">{pageTitle}</h1>
                            {pageDescription &&
                                <p className="text-xs mb-4 text-midnightBlue opacity-50">{pageDescription}</p>
                            }
                        </span>
                        {actionButton && buttonAction &&
                            <button
                                className="bg-deepOceanBlue hover:bg-deep-ocean-blue-gradient-end text-white
                                px-5 lg:px-10 py-0 h-10 rounded-full"
                                onClick={buttonAction}
                            >
                                {actionButton}
                            </button>
                        }
                    </div>
                )}
                {/* Content Section (Scrollable) */}
                <div className="px-4 py-3 flex-grow overflow-y-auto">
                    {children}
                </div>
            </div>

            {/* Right Section */}
            <div className="hidden lg:flex flex-col fixed top-0 right-0 h-full w-[25%] m-7">
                <InsightCard />
                <CalendarViewCard />
            </div>
            <AdminBottombar activeIcon={activeIcon} />
        </div>
    )
}

export default AdminLayout

import React from "react"
import WelcomeCard from "./dashboard/WelcomeCard"
import AdminSidebar from "./AdminSidebar"
import AdminNavbar from "./AdminNavbar"
import InsightCard from "./common/InsightCard"
import CalendarViewCard from "./common/CalendarViewCard"
import AdminBottombar from "./AdminBottombar"
import { FileUp } from "lucide-react"

const AdminLayout = ({
    activeIcon,
    children,
    showWelcomeCard,
    pageTitle,
    pageDescription,
    actionButton=null,
    buttonAction=null,
    secondButton=null,
    secondButtonAction=null,
}) => {
    return (
        <div className="bg-whiteOpacity02 min-h-screen flex h-screen overflow-hidden py-7">
            {/* Sidebar Section */}
            <div className="hidden lg:block h-full px-7">
                <AdminSidebar activeIcon={activeIcon} />
            </div>

            {/* Main Layout */}
            <div className="flex flex-col flex-grow w-full lg:w-4/5 h-screen px-4 lg:px-0">
                {/* Navbar */}
                <AdminNavbar />

                {/* Reserved space for WelcomeCard */}
                {showWelcomeCard && (
                    <div className="mt-4 lg:mt-2 transition-all duration-300 lg:px-3">
                        <WelcomeCard />
                    </div>
                )}

                {/* Reserved space for PageTitle */}
                {pageTitle && (
                    <div className="flex justify-between lg:px-4 mt-6">
                        <span className="flex flex-col">
                            <h1 className="text-xl lg:text-2xl font-medium text-midnightBlue">{pageTitle}</h1>
                            {pageDescription &&
                                <p className="text-xs mb-4 text-midnightBlue opacity-50">{pageDescription}</p>
                            }
                        </span>
                        <div className="flex gap-3">
                            {secondButton && secondButtonAction &&
                                <button
                                    className="flex items-center gap-1 bg-deepCrimsonRed hover:bg-deep-crimson-red-gradient-end text-white
                                    px-5 lg:px-10 py-0 h-10 rounded-full"
                                    onClick={secondButtonAction}
                                >
                                    {secondButton}
                                </button>
                            }
                            {actionButton && buttonAction &&
                                <button
                                    className="flex items-center gap-1 bg-deepOceanBlue hover:bg-deep-ocean-blue-gradient-end text-white
                                    px-5 lg:px-10 py-0 h-10 rounded-full"
                                    onClick={buttonAction}
                                >
                                    {actionButton}
                                    {actionButton === "Export" && <FileUp size={17} />}
                                </button>
                            }
                        </div>
                    </div>
                )}

                {/* Content Section (Scrollable) */}
                <div className="px-2 pb-10 lg:px-4 flex-grow overflow-y-auto">
                    {children}
                </div>
            </div>

            {/* Right Section */}
            <div className="hidden lg:flex flex-col gap-6 h-full w-[35%] px-7 overflow-y-auto">
                <InsightCard />
                <CalendarViewCard />
            </div>
            <AdminBottombar activeIcon={activeIcon} />
        </div>
    )
}

export default AdminLayout

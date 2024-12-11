import React from "react"
import AdminSidebar from "../../../components/admin/AdminSidebar"
import AdminNavbar from "../../../components/admin/navbar/AdminNavbar"
import DashboardCard from "../../../components/admin/dashboard/DashboardCard"
import WelcomeCard from "../../../components/admin/dashboard/WelcomeCard"
import MetricsCard from "../../../components/admin/dashboard/MetricsCard"
import Button from "../../../components/forms/Button"

const AdminDashboard = () => {
    return (
        <div className="bg-whiteOpacity05 min-h-screen p-4 lg:p-7 flex">
            {/* Sidebar Section (hidden on smaller screens) */}
            <div className="hidden lg:block fixed top-0 left-0 h-full m-7">
                <AdminSidebar />
            </div>

            {/* Main Layout */}
            <div className="flex flex-col w-full lg:w-3/5 lg:ml-[10%] lg:mr-[10%]">
                {/* Navbar */}
                <AdminNavbar />
                <WelcomeCard />
                {/* Content Section */}
                <div className="flex my-4 justify-between">
                    <h1 className="text-xl lg:text-2xl font-medium text-midnightBlue">Recent Metrics</h1>
                    <Button
                        type="button"
                        text="Export"
                        textColor = "text-white"
                        rounded = "rounded-full"
                        paddingx = "px-5 lg:px-10"
                        paddingy = "py-0 lg:py-2"
                        isLoading = {false}
                        isLoadingBackground = 'bg-labelGreen '
                        className = ""
                        loadingText = "Loading..."
                        backgroundColor = "bg-deepOceanBlue"
                        hoverBackgroundColor = "hover:bg-deep-ocean-blue-gradient-end"
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <MetricsCard />
                    <MetricsCard />
                    <MetricsCard />
                    <MetricsCard />
                </div>
            </div>

            {/* Right Section */}
            <div className="hidden lg:block fixed top-0 right-0 h-full w-[25%] m-7">
                <DashboardCard />
            </div>
        </div>
    )
}

export default AdminDashboard

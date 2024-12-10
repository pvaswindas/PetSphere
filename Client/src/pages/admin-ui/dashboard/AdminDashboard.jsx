import React from "react"
import AdminSidebar from "../../../components/admin/AdminSidebar"
import AdminNavbar from "../../../components/admin/navbar/AdminNavbar"
import DashboardCard from "../../../components/admin/dashboard/DashboardCard"
import WelcomeCard from "../../../components/admin/dashboard/WelcomeCard"

const AdminDashboard = () => {
    return (
        <div className="bg-white lg:bg-whiteOpacity95 min-h-screen gap-16 w-full p-7 flex">
            {/* Sidebar Section */}
            <AdminSidebar />

            {/* Main Layout */}
            <div className="flex flex-col w-4/5">
                {/* Navbar */}
                <AdminNavbar />
                <WelcomeCard />
                {/* Content Section */}
                <div className="flex gap-4">
                    <DashboardCard />
                    <DashboardCard />
                </div>
                <div className="flex my-4 gap-4">
                    <DashboardCard />
                    <DashboardCard />
                </div>
            </div>

            <div className="flex flex-col w-2/5">
                <DashboardCard />
            </div>
        </div>
    )
}

export default AdminDashboard

import React, { useState } from "react"
import MetricsCard from "../../../components/admin/dashboard/MetricsCard"
import Button from "../../../components/forms/Button"
import AdminLayout from "../../../components/admin/AdminLayout"

const AdminDashboard = () => {
    const [activeIcon, setActiveIcon] = useState("dashboard")

    return (
        <AdminLayout activeIcon={activeIcon} setActiveIcon={setActiveIcon} showWelcomeCard={true}>
            {/* Content Section */}
            <div className="flex my-4 justify-between">
                <h1 className="text-xl lg:text-2xl font-medium text-midnightBlue">Recent Metrics</h1>
                <Button
                    type="button"
                    text="Export"   
                    textColor="text-white"
                    rounded="rounded-full"
                    paddingx="px-5 lg:px-10"
                    paddingy="py-0 lg:py-2"
                    isLoading={false}
                    isLoadingBackground="bg-labelGreen"
                    className=""
                    loadingText="Loading..."
                    backgroundColor="bg-deepOceanBlue"
                    hoverBackgroundColor="hover:bg-deep-ocean-blue-gradient-end"
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MetricsCard />
                <MetricsCard />
                <MetricsCard />
                <MetricsCard />
            </div>
        </AdminLayout>
    )
}

export default AdminDashboard

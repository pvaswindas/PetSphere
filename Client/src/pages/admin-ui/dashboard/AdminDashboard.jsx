import React from "react";
import MetricsCard from "../../../components/admin/dashboard/MetricsCard";
import AdminLayout from "../../../components/admin/AdminLayout";
import PetListingLocationTreemap from "../../../components/admin/dashboard/charts/PetListingLocationTreemap";
import PostEngagementPieChart from "../../../components/admin/dashboard/charts/PostEngagementPieChart";
import UserStatusChart from "../../../components/admin/dashboard/charts/UserStatusChart";
import ReportsFlagChart from "../../../components/admin/dashboard/charts/ReportsFlagChart";

const AdminDashboard = () => {
    const activeIcon = "dashboard";

    return (
        <AdminLayout
            activeIcon={activeIcon}
            showWelcomeCard={true}
            pageTitle={"Recent Metrics"}
            pageDescription={"View recent platform metrics to track performance and user activity."}
        >
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-24 lg:pb-16">

                <MetricsCard title="Users Status Overview ">
                    <UserStatusChart />
                </MetricsCard>
                
                <MetricsCard title="Listing Locations">
                    <PetListingLocationTreemap />
                </MetricsCard>

                <MetricsCard title="Post Engagements">
                    <PostEngagementPieChart />
                </MetricsCard>
                
                <MetricsCard title="Reports & Flags">
                    <ReportsFlagChart />
                </MetricsCard>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;

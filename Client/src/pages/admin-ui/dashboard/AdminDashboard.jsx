import React from "react";
import MetricsCard from "../../../components/admin/dashboard/MetricsCard";
import AdminLayout from "../../../components/admin/AdminLayout";
import SubscriptionRevenueChart from "../../../components/admin/dashboard/charts/SubscriptionRevenueChart";
import SubscriptionStatusChart from "../../../components/admin/dashboard/charts/SubscriptionStatusChart";
import PetListingLocationTreemap from "../../../components/admin/dashboard/charts/PetListingLocationTreemap";
import PostEngagementPieChart from "../../../components/admin/dashboard/charts/PostEngagementPieChart";

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

                <MetricsCard title="Revenue Overview ">
                    <SubscriptionRevenueChart />
                </MetricsCard>
                
                <MetricsCard title="Listing Locations">
                    <PetListingLocationTreemap />
                </MetricsCard>

                <MetricsCard title="Post Engagements">
                    <PostEngagementPieChart />
                </MetricsCard>
                
                <MetricsCard title="Subscription Status">
                    <SubscriptionStatusChart />
                </MetricsCard>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;

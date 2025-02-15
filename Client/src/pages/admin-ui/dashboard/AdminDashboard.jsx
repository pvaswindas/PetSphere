import React, { useState, useEffect } from "react";
import MetricsCard from "../../../components/admin/dashboard/MetricsCard";
import Button from "../../../components/forms/Button";
import AdminLayout from "../../../components/admin/AdminLayout";
import axiosInstance from "../../../axios/axiosinstance";

const AdminDashboard = () => {
    const [activeIcon, setActiveIcon] = useState("dashboard");
    const [engagementData, setEngagementData] = useState([]);

    useEffect(() => {
        axiosInstance.get("posts/admin/metrics/engagement")
            .then(response => {
                console.log("Fetched engagement data:", response.data);
                setEngagementData(response.data);
            })
            .catch(error => {
                console.error("Error fetching engagement data:", error);
            });
    }, []);    

    const barChartData = [
        { name: "Likes", value: 300 },
        { name: "Comments", value: 150 },
        { name: "Saves", value: 200 },
    ];

    return (
        <AdminLayout activeIcon={activeIcon} setActiveIcon={setActiveIcon} showWelcomeCard={true}>
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
                <MetricsCard title="User Engagement" data={barChartData} type="bar" />
                <MetricsCard title="User Growth" data={barChartData} type="bar" />
                <MetricsCard title="Post Engagement Distribution" data={engagementData} type="pie" />
                <MetricsCard title="Other Metric" data={barChartData} type="bar" />
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;

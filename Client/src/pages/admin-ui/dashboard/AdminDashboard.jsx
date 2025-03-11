import React, { useState, useEffect } from "react";
import MetricsCard from "../../../components/admin/dashboard/MetricsCard";
import AdminLayout from "../../../components/admin/AdminLayout";
import { PieChart } from '@mui/x-charts/PieChart';
import { fetchPostEngagementData } from "../../../api/metrics";
import AlertSnackbar from "../../../components/Snackbar/AlertSnackbar";
import Shimmer from "../../../components/Shimmer/Shimmer";

const AdminDashboard = () => {
    const activeIcon = "dashboard";
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [engagementData, setEngagementData] = useState([]);

    const COLORS = ["#a4bfec", "#6a8abb", "#2959a1"];

    useEffect(() => {
        const getPostEngagementData = async () => {
            setIsLoading(true);
            try {
                const response = await fetchPostEngagementData();
                setEngagementData(response || []);
            } catch (error) {
                setSnackbarMessage("Error fetching post engagement data!");
                setSnackbarOpen(true);
            } finally {
                setIsLoading(false);
            }
        };
        getPostEngagementData();
    }, []);

    return (
        <AdminLayout
            activeIcon={activeIcon}
            showWelcomeCard={true}
            pageTitle={"Recent Metrics"}
            pageDescription={"View recent platform metrics to track performance and user activity."}
        >
            <AlertSnackbar
                open={snackbarOpen}
                message={snackbarMessage}
                alert_type="error"
                onClose={() => setSnackbarOpen(false)}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-24 lg:pb-16">
                <MetricsCard title="Subscription Metrics">
                    {isLoading ? <Shimmer className="h-32 w-full rounded-xl" /> : null}
                </MetricsCard>
                <MetricsCard title="User Engagement">
                    {isLoading ? <Shimmer className="h-32 w-full rounded-xl" /> : null}
                </MetricsCard>
                <MetricsCard title="Post Engagements">
                    {isLoading ? (
                        <div className="flex items-center justify-center w-full h-full">
                            <Shimmer className="w-[150px] h-[150px] rounded-full" />
                            <div className="flex flex-col ml-4">
                                {[...Array(3)].map((_, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <Shimmer className="w-1 h-6 my-1" />
                                        <Shimmer className="w-16 h-4" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center ml-10 w-full h-full">
                            <PieChart
                                className="p-0 m-0"
                                series={[
                                    {
                                        data: engagementData.map((d, index) => ({
                                            id: index,
                                            value: d.value,
                                            color: COLORS[index % COLORS.length]
                                        }))
                                    }
                                ]}
                            />
                            <div className="flex flex-col gap-1 mr-10">
                                {engagementData?.map((d, index) => (
                                    <div key={d.id || index} className="flex items-center gap-2">
                                        <span
                                            className="w-1 h-6 bg-black"    
                                            style={{ backgroundColor: COLORS[index % COLORS.length] }}>
                                        </span>
                                        <p className="text-xs">{d.name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </MetricsCard>
                <MetricsCard title="Revenue Overview">
                    {isLoading ? <Shimmer className="h-32 w-full rounded-xl" /> : null}
                </MetricsCard>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;

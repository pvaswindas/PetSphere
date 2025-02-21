import React, { useState, useEffect } from "react";
import MetricsCard from "../../../components/admin/dashboard/MetricsCard";
import AdminLayout from "../../../components/admin/AdminLayout";
import axiosInstance from "../../../axios/axiosinstance";
import { PieChart } from '@mui/x-charts/PieChart';

const AdminDashboard = () => {
    const activeIcon = "dashboard"
    const [engagementData, setEngagementData] = useState([]);

    const COLORS = ["#89ABE1", "#ECF4FF"];

    useEffect(() => {
        axiosInstance.get("posts/admin/metrics/engagement")
            .then(response => {
                setEngagementData(response.data);
            })
            .catch(error => {
                return
            });
    }, []);

    return (
        <AdminLayout
            activeIcon={activeIcon}
            showWelcomeCard={true}
            pageTitle={"Recent Metrics"}
            pageDescription={"View recent platform metrics to track performance and user activity."}
            actionButton={"Export"}
            buttonAction={null}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MetricsCard title="Subscription Metrics">

                </MetricsCard>
                <MetricsCard title="User Engagement">

                </MetricsCard>
                <MetricsCard title="Post Engagement">
                    <PieChart
                        series={[
                            {
                                data: engagementData.map((d, index) => ({
                                    id: index,
                                    value: d.value,
                                    label: d.name,
                                    color: COLORS[index % COLORS.length]
                                }))
                            }
                        ]}
                        width={400}
                        height={150}
                    />
                </MetricsCard>
                <MetricsCard title="Revenue Overview" >

                </MetricsCard>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;

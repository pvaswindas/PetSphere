import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { fetchPostEngagementData } from "../../../../api/metrics";
import AlertSnackbar from "../../../Snackbar/AlertSnackbar";
import Shimmer from "../../../Shimmer/Shimmer";

const COLORS = ["#a4bfec", "#6a8abb", "#2959a1"];

const PostEngagementPieChart = () => {
    const [engagementData, setEngagementData] = useState([]);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

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

    if (isLoading) {
        return <Shimmer className="h-44 w-full rounded-xl" />;
    }

    // Prepare data for ApexCharts
    const series = engagementData.map(item => item.value);
    const labels = engagementData.map(item => item.name);

    const options = {
        chart: {
            type: 'pie',
            toolbar: {
                show: false,
            }
        },
        labels: labels,
        colors: COLORS,
        legend: {
            show: false,
        },
        dataLabels: {
            enabled: false,
        },
        tooltip: {
            enabled: true,
            y: {
                formatter: (value) => value
            }
        },
        stroke: {
            width: 0
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '0%'
                }
            }
        }
    };

    return (
        <div className="flex items-center justify-center ml-10 w-full h-full">
            <AlertSnackbar
                open={snackbarOpen}
                message={snackbarMessage}
                alert_type="error"
                onClose={() => setSnackbarOpen(false)}
            />
            <div className="flex flex-row items-center">
                <ReactApexChart 
                    options={options}
                    series={series}
                    type="pie"
                    height={176}
                    width={250}
                />
                <div className="flex flex-col gap-1 mr-10">
                    {engagementData.map((d, index) => (
                        <div key={d.id || index} className="flex items-center gap-2">
                            <span
                                className="w-1 h-6"
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            ></span>
                            <p className="text-xs">{d.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PostEngagementPieChart;
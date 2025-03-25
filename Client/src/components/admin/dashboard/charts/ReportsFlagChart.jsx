import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import Shimmer from "../../../Shimmer/Shimmer";
import { fetchReportsData } from "../../../../api/metrics";

const COLORS = ["#2959a1", "#6a8abb", "#a4bfec"];

const ReportsFlagChart = () => {
    const [reportsData, setReportsData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getReportsData = async () => {
            setIsLoading(true);
            try {
                const response = await fetchReportsData();
                const chartData = Object.entries(response).map(([name, value]) => ({
                    name,
                    value
                }));
                setReportsData(chartData);
            } catch (error) {
                console.error("Error fetching reports data:", error);
                setError("Failed to load reports data");
            } finally {
                setIsLoading(false);
            }
        };

        getReportsData();
    }, []);

    if (isLoading) {
        return <Shimmer className="h-44 w-full rounded-xl" />;
    }

    if (error) {
        return (
            <div className="flex items-center justify-center w-full">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    const series = reportsData.map(item => item.value);
    const labels = reportsData.map(item => item.name);

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
            <div className="flex flex-row items-center">
                <ReactApexChart 
                    options={options}
                    series={series}
                    type="pie"
                    height={176}
                    width={250}
                />
                <div className="flex flex-col gap-1 mr-10">
                    {reportsData.map((d, index) => (
                        <div key={d.name} className="flex items-center gap-2">
                            <span
                                className="w-1 h-6"
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            ></span>
                            <p className="text-xs capitalize">{d.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ReportsFlagChart;
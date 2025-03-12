import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { fetchSubscriptionRevenueData } from "../../../../api/metrics";

const SubscriptionRevenueChart = () => {
  const [revenueData, setRevenueData] = useState({
    months: [],
    recharge: [],
    monthly: [],
    yearly: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetchSubscriptionRevenueData();
        setRevenueData(response);
      } catch (err) {
        setError("Failed to load subscription revenue data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartOptions = {
    chart: {
      type: 'area',
      height: 250,
      toolbar: {
        show: false
      },
      fontFamily: 'Poppins, Arial, sans-serif',
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    colors: ['#ff9800', '#2959a1', '#6a8abb'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100]
      }
    },
    xaxis: {
      categories: revenueData.months,
      labels: {
        style: {
          fontSize: '10px',
          fontFamily: 'Poppins, Arial, sans-serif',
        }
      }
    },
    yaxis: {
      labels: {
        formatter: function (value) {
          return '$' + value.toFixed(0);
        },
        style: {
          fontSize: '10px',
          fontFamily: 'Poppins, Arial, sans-serif',
        }
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      fontSize: '12px',
      fontFamily: 'Poppins, Arial, sans-serif',
    },
    tooltip: {
      y: {
        formatter: function (value) {
          return '$' + value.toFixed(2);
        }
      }
    }
  };

  const series = [
    {
      name: 'Recharge',
      data: revenueData.recharge
    },
    {
      name: 'Monthly',
      data: revenueData.monthly
    },
    {
      name: 'Yearly',
      data: revenueData.yearly
    }
  ];

  if (isLoading) return null;
  if (error) return <div className="text-sm text-red-500">{error}</div>;

  return (
    <div className="w-full h-full">
      <Chart 
        options={chartOptions} 
        series={series} 
        type="area" 
        height="100%" 
      />
    </div>
  );
};

export default SubscriptionRevenueChart;
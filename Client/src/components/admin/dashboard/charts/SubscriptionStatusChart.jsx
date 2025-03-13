import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { fetchSubscriptionStatusData } from "../../../../api/metrics";

const SubscriptionStatusChart = () => {
  const [statusData, setStatusData] = useState({
    categories: [],
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
        const response = await fetchSubscriptionStatusData();
        setStatusData(response);
      } catch (err) {
        setError("Failed to load subscription status data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartOptions = {
    chart: {
      type: 'bar',
      height: 250,
      stacked: true,
      toolbar: {
        show: false
      },
      fontFamily: 'Poppins, Arial, sans-serif',
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 2,
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 1,
      colors: ['transparent']
    },
    colors: ['#ff9800', '#2959a1', '#6a8abb'],
    xaxis: {
      categories: statusData.categories,
      labels: {
        style: {
          fontSize: '10px',
          fontFamily: 'Poppins, Arial, sans-serif',
        }
      }
    },
    yaxis: {
      title: {
        text: 'Number of Users',
        style: {
          fontSize: '12px',
          fontFamily: 'Poppins, Arial, sans-serif',
        }
      },
      labels: {
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
        formatter: function (val) {
          return val + " users"
        }
      }
    },
    fill: {
      opacity: 1
    }
  };

  const series = [
    {
      name: 'Recharge',
      data: statusData.recharge
    },
    {
      name: 'Monthly',
      data: statusData.monthly
    },
    {
      name: 'Yearly',
      data: statusData.yearly
    }
  ];

  if (isLoading) return null;
  if (error) return <div className="text-sm text-red-500">{error}</div>;

  return (
    <div className="w-full h-full">
      <Chart 
        options={chartOptions} 
        series={series} 
        type="bar" 
        height="100%" 
      />
    </div>
  );
};

export default SubscriptionStatusChart;
import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { fetchSubscriptionStatusData } from "../../../../api/metrics";
import Shimmer from "../../../Shimmer/Shimmer";

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

          console.log(response)
          
          // Validate response data
          if (response && 
            Array.isArray(response.categories) && 
            Array.isArray(response.recharge) && 
            Array.isArray(response.monthly) && 
            Array.isArray(response.yearly)) {

          // Check if all values are zeros
          const allZeros = response.recharge.every(val => val === 0) && 
                          response.monthly.every(val => val === 0) && 
                          response.yearly.every(val => val === 0);

          if (!allZeros) {
            setStatusData(response);
          }
        }
      } catch (err) {
        console.error("Error fetching subscription status data:", err);
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
      height: 190,
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
    },
    noData: {
      text: 'No subscription data available',
      align: 'center',
      verticalAlign: 'middle',
      style: {
        fontSize: '14px',
        fontFamily: 'Poppins, Arial, sans-serif',
      }
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

  // Check if we have data to display
  const hasData = statusData.categories.length > 0 && 
                  statusData.recharge.length > 0 && 
                  statusData.monthly.length > 0 && 
                  statusData.yearly.length > 0;

  if (isLoading) {
    return <Shimmer className="h-full w-full rounded-xl" />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center w-full">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="flex items-center justify-center w-full">
        <p className="text-sm text-gray-500">No subscription data available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <Chart 
        options={chartOptions} 
        series={series} 
        type="bar" 
        height="190" 
      />
    </div>
  );
};

export default SubscriptionStatusChart;
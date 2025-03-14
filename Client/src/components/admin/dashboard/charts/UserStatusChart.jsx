import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import Shimmer from "../../../Shimmer/Shimmer";
import { fetchUserStatusData } from "../../../../api/metrics";

const UserStatusChart = () => {
  const [statusData, setStatusData] = useState({
    categories: [],
    active: [],
    inactive: [],
    suspended: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetchUserStatusData();
        
        console.log(response);
        
        // Validate response data
        if (response && 
            Array.isArray(response.categories) && 
            Array.isArray(response.active) && 
            Array.isArray(response.inactive) && 
            Array.isArray(response.suspended)) {

          // Check if all values are zeros
          const allZeros = response.active.every(val => val === 0) && 
                          response.inactive.every(val => val === 0) && 
                          response.suspended.every(val => val === 0);

          if (!allZeros) {
            setStatusData(response);
          }
        }
      } catch (err) {
        console.error("Error fetching user status data:", err);
        setError("Failed to load user status data");
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
    colors: ['#2959a1', '#9e9e9e', '#f44336'],
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
      text: 'No user status data available',
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
      name: 'Active',
      data: statusData.active
    },
    {
      name: 'Inactive',
      data: statusData.inactive
    },
    {
      name: 'Suspended',
      data: statusData.suspended
    }
  ];

  // Check if we have data to display
  const hasData = statusData.categories.length > 0 && 
                  statusData.active.length > 0 && 
                  statusData.inactive.length > 0 && 
                  statusData.suspended.length > 0;

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
        <p className="text-sm text-gray-500">No user status data available</p>
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

export default UserStatusChart;
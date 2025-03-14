import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { fetchSubscriptionRevenueData } from '../../../../api/metrics';
import Shimmer from '../../../Shimmer/Shimmer';

const SubscriptionRevenueChart = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [revenueData, setRevenueData] = useState({
    categories: [],
    series: []
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRevenueData = async () => {
      setIsLoading(true);
      try {
        const response = await fetchSubscriptionRevenueData();
        setRevenueData(response || { categories: [], series: [] });
      } catch (error) {
        console.error('Error fetching subscription revenue data:', error);
        setError('Failed to load revenue data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRevenueData();
  }, []);

  const chartOptions = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: {
        show: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    xaxis: {
      type: 'category',
      categories: revenueData.categories || [],
      tickAmount: 10
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy'
      }
    },
    colors: ['#2959a1', '#6a8abb']
  };

  // Make sure series has the proper structure for ApexCharts
  const series = revenueData.series || [];
  
  // Ensure each series has a name and data property
  const formattedSeries = series.map(item => {
    return {
      name: item.name || 'Revenue',
      data: item.data || []
    };
  });

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

  // Ensure we have data to display
  if (!formattedSeries.length || !revenueData.categories || !revenueData.categories.length) {
    return (
      <div className="flex items-center justify-center w-full">
        <p className="text-gray-500">No revenue data available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <Chart 
        options={chartOptions}
        series={formattedSeries}
        type="area"
        height="350"
      />
    </div>
  );
};

export default SubscriptionRevenueChart;
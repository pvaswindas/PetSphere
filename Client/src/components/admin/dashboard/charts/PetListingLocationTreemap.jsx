import React, { useState, useEffect, useCallback } from 'react';
import Chart from 'react-apexcharts';
import { fetchPetListingLocationData } from '../../../../api/metrics';
import Shimmer from '../../../Shimmer/Shimmer';

const PetListingLocationTreemap = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [locationData, setLocationData] = useState([]);
    const [error, setError] = useState(null);
  
    // Process location data to group by state and city
    const processLocationData = useCallback((data) => {
      // Handle the case when data is undefined or empty
      if (!data || data.length === 0) {
        return [];
      }

      try {
        // Group by state
        const stateGroups = data.reduce((acc, item) => {
          const state = item.state;
          if (!acc[state]) {
            acc[state] = {
              count: 0,
              cities: {}
            };
          }
          
          acc[state].count += 1;
          
          // Group by city within state
          const city = item.city;
          if (!acc[state].cities[city]) {
            acc[state].cities[city] = 0;
          }
          acc[state].cities[city] += 1;
          
          return acc;
        }, {});
    
        // Transform into treemap format
        const treemapData = [];
        
        Object.entries(stateGroups).forEach(([state, stateData]) => {
          // Add state as parent
          treemapData.push({
            x: state,
            y: stateData.count
          });
          
          // Add cities as children
          Object.entries(stateData.cities).forEach(([city, count]) => {
            treemapData.push({
              x: city,
              y: count,
            });
          });
        });
        
        return treemapData;
      } catch (err) {
        console.error("Error processing location data:", err);
        return [];
      }
    }, []);

    useEffect(() => {
      const fetchLocationData = async () => {
        setIsLoading(true);
        try {
          const response = await fetchPetListingLocationData();
          // Process and transform data for treemap format
          const processedData = processLocationData(response || []);
          setLocationData(processedData);
        } catch (error) {
          console.error('Error fetching pet listing location data:', error);
          setError('Failed to load location data');
        } finally {
          setIsLoading(false);
        }
      };

      fetchLocationData();
    }, [processLocationData]);

    const chartOptions = {
      chart: {
        type: 'treemap',
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        treemap: {
          distributed: true,
          enableShades: false
        }
      },
      legend: {
        show: false
      },
      tooltip: {
        y: {
          formatter: (value) => `${value} listings`
        }
      },
      colors: [
        '#2959a1', '#3d6db5', '#5280c5', '#6a8abb', '#81a4d1',
        '#a4bfec', '#c2d4f0', '#d7e3f5', '#ebf0fa'
      ]
    };

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
    if (!locationData || locationData.length === 0) {
      return (
        <div className="flex items-center justify-center w-full">
          <p className="text-gray-500">No location data available</p>
        </div>
      );
    }

    return (
      <div className="w-full h-full">
        <Chart 
          options={chartOptions}
          series={[{ data: locationData }]}
          type="treemap"
          height="190"
        />
      </div>
    );
};

export default PetListingLocationTreemap;
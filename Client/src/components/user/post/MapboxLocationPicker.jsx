import React, { useState, useEffect } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import GeoMap from '../../map/GeoMap';
import { useNavigate } from 'react-router-dom';

const MapboxLocationPicker = () => {
    const navigate = useNavigate()
    const petListingKey = localStorage.getItem('petListingKey')
    const [viewState, setViewState] = useState({
        longitude: 77.209,
        latitude: 28.613,
        zoom: 12,
    });

    const [location, setLocation] = useState({
        longitude: 77.209,
        latitude: 28.613,
        address: '',
        city: '',
        state: '',
        country: '',
        pincode: '',
    });

    const fetchLocationDetails = async (lat, lng) => {
        try {
            const response = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}`
            );
            const data = await response.json();
            const feature = data.features[0];
            
            const address = feature?.place_name || '';
            const city = feature?.context.find((ctx) => ctx.id.includes('place'))?.text || '';
            const state = feature?.context.find((ctx) => ctx.id.includes('region'))?.text || '';
            const country = feature?.context.find((ctx) => ctx.id.includes('country'))?.text || '';
            const pincode = feature?.context.find((ctx) => ctx.id.includes('postcode'))?.text || '';
            
            setLocation({
                longitude: lng,
                latitude: lat,
                address,
                city,
                state,
                country,
                pincode,
            });
        } catch (error) {
            console.error('Error fetching address:', error);
        }
    };

    useEffect(() => {
        if (!petListingKey) {
            navigate('/add-pet-listing')
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setViewState({ longitude, latitude, zoom: 14 });
                fetchLocationDetails(latitude, longitude);
            },
            (error) => {
                console.error('Error fetching user location:', error);
            }
        );
    }, [navigate, petListingKey]);

    const handleMapClick = async (event) => {
        const { lng, lat } = event.lngLat;
        setLocation({ ...location, longitude: lng, latitude: lat });
        await fetchLocationDetails(lat, lng);
    };

    const handleSubmit = () => {
        console.log('Location Submitted:', location);
        alert(`Location saved: ${location.address}`);
    };

    return (
        <div className="flex flex-col p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">Select Your Location</h2>
            
            <div className='flex flex-col lg:flex-row'>
                {/* Map Section */}
                <div className="relative w-full h-[20rem] lg:h-[400px] rounded-t-lg lg:rounded-tr-none lg:rounded-s-lg overflow-hidden">
                    <GeoMap
                        viewState={viewState}
                        onMove={(evt) => setViewState(evt.viewState)}
                        onClick={handleMapClick}
                        longitude={location.longitude}
                        latitude={location.latitude}
                        mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
                    />
                </div>

                {/* Location Details */}
                <div className="w-full lg:w-1/2 p-6 lg:h-[400px] bg-lightTextGreyOpacity10 rounded-b-lg lg:rounded-bl-none lg:rounded-e-lg">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Location Details</h3>
                    <div className="text-gray-600 space-y-2">
                        <p className="flex space-x-3">
                            <span className="font-semibold text-sm text-gray-700">Address:</span>
                            <span>{location.address || ''}</span>
                        </p>
                        <p className="flex space-x-2">
                            <span className="font-semibold text-sm text-gray-700">City:</span>
                            <span>{location.city || ''}</span>
                        </p>
                        <p className="flex space-x-2">
                            <span className="font-semibold text-sm text-gray-700">State:</span>
                            <span>{location.state || ''}</span>
                        </p>
                        <p className="flex space-x-2">
                            <span className="font-semibold text-sm text-gray-700">Country:</span>
                            <span>{location.country || ''}</span>
                        </p>
                        <p className="flex space-x-2">
                            <span className="font-semibold text-sm text-gray-700">Pincode:</span>
                            <span>{location.pincode || ''}</span>
                        </p>
                    </div>
                </div>
            </div>
                
            {/* Save Button */}
            <button
                onClick={handleSubmit}
                className="mt-6 p-2 bg-og-gradient hover:bg-og-gradient-opp text-white rounded-lg shadow-lg hover:bg-blue-700"
            >
                Save Location
            </button>
        </div>
    );
};

export default MapboxLocationPicker;

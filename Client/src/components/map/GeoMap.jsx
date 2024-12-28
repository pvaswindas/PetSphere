import React from 'react';
import Map, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const GeoMap = ({ viewState, onMove, onClick, longitude, latitude, mapboxAccessToken }) => {
    return (
        <Map
            {...viewState}
            onMove={onMove}
            onClick={onClick}
            style={{ width: '100%', height: '100%' }}
            mapStyle="mapbox://styles/mapbox/streets-v11"
            mapboxAccessToken={mapboxAccessToken}
        >
            <Marker longitude={longitude} latitude={latitude}>
                <div className="bg-red-500 rounded-full w-3 h-3 border-2 border-white shadow-md"></div>
            </Marker>
        </Map>
    );
};

export default GeoMap;

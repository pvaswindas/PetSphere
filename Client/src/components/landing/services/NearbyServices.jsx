import React from 'react';
import ServiceCard from './ServiceCard';
import { services } from './servicesData';

export default function NearbyServices() {
    return (
        <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Everything Your Pet Needs
            </h2>
            <p className="text-xl text-gray-600">
                Discover pet services in your neighborhood
            </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
                <ServiceCard key={index} {...service} />
            ))}
            </div>
        </div>
        </div>
    );
}
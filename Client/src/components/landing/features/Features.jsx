import React from 'react';
import FeatureCard from './FeatureCard';
import { features } from './featuresData';

export default function Features() {
    return (
        <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Everything for Pet Lovers
            </h2>
            <p className="text-xl text-gray-600">
                Connect, share, and trade in the world's largest pet community
            </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
                <FeatureCard key={index} {...feature} />
            ))}
            </div>
        </div>
        </div>
    );
}
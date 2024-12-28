import React from 'react';
import TrustCard from './TrustCard';
import { badges } from './trustData';

export default function TrustBadges() {
    return (
        <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Trust & Quality Assurance
            </h2>
            <p className="text-xl text-gray-600">
                Our badge system ensures the highest standards in pet trading
            </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
            {badges.map((badge, index) => (
                <TrustCard key={index} {...badge} />
            ))}
            </div>
        </div>
        </div>
    );
}
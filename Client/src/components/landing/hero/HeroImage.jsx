import React from 'react';

export default function HeroImage() {
    return (
        <div className="relative">
        <img
            src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=800&q=80"
            alt="Happy pets"
            className="rounded-2xl shadow-2xl"
        />
        <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg">
            <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-teal-600">1M+</div>
            <div className="text-sm text-gray-600">Pet lovers<br />worldwide</div>
            </div>
        </div>
        </div>
    );
}
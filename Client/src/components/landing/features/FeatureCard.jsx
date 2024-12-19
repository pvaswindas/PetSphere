import React from 'react';

export default function FeatureCard({ icon: Icon, title, description, color }) {
    return (
        <div className="text-center">
        <div className={`${color} rounded-full p-4 w-16 h-16 mx-auto mb-6`}>
            <Icon className="h-8 w-8 text-teal-600" />
        </div>
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        <p className="text-gray-600">{description}</p>
        </div>
    );
}
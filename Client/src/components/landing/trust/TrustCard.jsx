import React from 'react';

export default function TrustCard({ icon: Icon, title, description }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
        <div className="bg-teal-100 rounded-full p-3 w-12 h-12 mb-4">
            <Icon className="h-6 w-6 text-teal-600" />
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
        </div>
    );
}
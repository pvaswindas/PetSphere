import React from 'react';

export default function ServiceCard({ icon: Icon, title, description }) {
    return (
        <div className="group">
        <div className="bg-white p-6 rounded-xl shadow-sm group-hover:shadow-md transition">
            <div className="bg-teal-100 rounded-full p-3 w-12 h-12 mb-4">
            <Icon className="h-6 w-6 text-teal-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-gray-600 mb-4">{description}</p>
            <button className="text-teal-600 font-medium hover:text-teal-700 transition">
            Find Nearby →
            </button>
        </div>
        </div>
    );
}
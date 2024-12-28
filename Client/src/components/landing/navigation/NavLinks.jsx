import React from 'react';

export default function NavLinks() {
    return (
        <div className="flex space-x-6">
        <a href="#" className="text-gray-600 hover:text-teal-600 transition">PawStories</a>
        <a href="#" className="text-gray-600 hover:text-teal-600 transition">PetListings</a>
        <a href="#" className="text-gray-600 hover:text-teal-600 transition">Community</a>
        </div>
    );
}
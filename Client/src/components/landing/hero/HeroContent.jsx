import React from 'react';
import { PawPrint, ShoppingBag } from 'lucide-react';

export default function HeroContent() {
    return (
        <div className="text-center md:text-left">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Where Pet Lovers <span className="text-teal-600">Connect</span> and <span className="text-teal-600">Share</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8">
            Join the ultimate community for pet enthusiasts. Share PawStories, discover PetListings, and connect with fellow animal lovers.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button className="flex items-center justify-center space-x-2 bg-teal-600 text-white px-8 py-3 rounded-full hover:bg-teal-700 transition">
            <PawPrint className="h-5 w-5" />
            <span>Share PawStories</span>
            </button>
            <button className="flex items-center justify-center space-x-2 border-2 border-teal-600 text-teal-600 px-8 py-3 rounded-full hover:bg-teal-50 transition">
            <ShoppingBag className="h-5 w-5" />
            <span>Browse PetListings</span>
            </button>
        </div>
        </div>
    );
}
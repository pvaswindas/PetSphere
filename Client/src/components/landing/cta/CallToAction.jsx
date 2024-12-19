import React from 'react';
import { PawPrint } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CallToAction() {
    const navigate = useNavigate()
    return (
        <div className="bg-teal-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Join the PetSphere Community?
            </h2>
            <p className="text-xl text-teal-100 mb-8">
                Start sharing your PawStories and discover amazing pets today
            </p>
            <button onClick={() => navigate('/signup')} className="flex items-center space-x-2 bg-white text-teal-600 px-8 py-3 rounded-full mx-auto hover:bg-teal-50 transition">
                <PawPrint className="h-5 w-5" />
                <span>Join PetSphere Now</span>
            </button>
        </div>
        </div>
    );
}
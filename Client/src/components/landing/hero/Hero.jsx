import React from 'react';
import HeroContent from './HeroContent';
import HeroImage from './HeroImage';

export default function Hero() {
    return (
        <div className="pt-24 pb-16 bg-gradient-to-br from-teal-50 via-white to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
            <HeroContent />
            <HeroImage />
            </div>
        </div>
        </div>
    );
}
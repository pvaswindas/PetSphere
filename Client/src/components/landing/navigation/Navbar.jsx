import React from 'react';
import { Search, Menu } from 'lucide-react';
import NavLinks from './NavLinks';
import NavButtons from './NavButtons';
import Logo from './Logo';

export default function Navbar() {
    return (
        <nav className="fixed top-0 w-full bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
            <Logo />
            
            <div className="hidden md:flex items-center space-x-8">
                <NavLinks />
                <div className="relative">
                <input
                    type="text"
                    placeholder="Search PawStories & PetListings..."
                    className="pl-10 pr-4 py-2 w-64 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                <NavButtons />
            </div>
            
            <button className="md:hidden p-2">
                <Menu className="h-6 w-6 text-gray-600" />
            </button>
            </div>
        </div>
        </nav>
    );
}
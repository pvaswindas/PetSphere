import React from 'react';
import { UserPlus, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AuthCTA() {
    const navigate = useNavigate()
    return (
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-white">
                <h2 className="text-3xl font-bold mb-4">Join Our Growing Community</h2>
                <ul className="space-y-4">
                <li className="flex items-center space-x-2">
                    <div className="bg-teal-500 rounded-full p-1">
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    </div>
                    <span>Share your pet's journey with PawStories</span>
                </li>
                <li className="flex items-center space-x-2">
                    <div className="bg-teal-500 rounded-full p-1">
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    </div>
                    <span>Buy and sell with verified pet enthusiasts</span>
                </li>
                <li className="flex items-center space-x-2">
                    <div className="bg-teal-500 rounded-full p-1">
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    </div>
                    <span>Access exclusive pet services and deals</span>
                </li>
                </ul>
            </div>
            
            <div className="space-y-4">
                <button onClick={() => navigate('/signup')} className="w-full flex items-center justify-center space-x-2 bg-white text-teal-600 px-8 py-3 rounded-full hover:bg-teal-50 transition">
                    <UserPlus className="h-5 w-5" />
                    <span>Create Account</span>
                </button>
                <button onClick={() => navigate('/login')} className="w-full flex items-center justify-center space-x-2 border-2 border-white text-white px-8 py-3 rounded-full hover:bg-white/10 transition">
                    <LogIn className="h-5 w-5" />
                    <span>Sign In</span>
                </button>
            </div>
            </div>
        </div>
        </div>
    );
}
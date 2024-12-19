import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NavButtons() {
    const navigate = useNavigate()
    return (
        <div className="flex items-center space-x-4">
        <button onClick={() => navigate('/login')} className="px-4 py-2 text-teal-600 hover:text-teal-700 transition">
            Sign In
        </button>
        <button onClick={() => navigate('/signup')} className="px-4 py-2 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition">
            Join PetSphere
        </button>
        </div>
    );
}
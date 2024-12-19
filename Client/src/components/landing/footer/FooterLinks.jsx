import React from 'react';

export default function FooterLinks() {
    return (
        <>
        <div>
            <h4 className="text-white text-lg font-semibold mb-4">Features</h4>
            <ul className="space-y-2">
            <li><a href="#" className="hover:text-white transition">PawStories</a></li>
            <li><a href="#" className="hover:text-white transition">PetListings</a></li>
            <li><a href="#" className="hover:text-white transition">Community</a></li>
            </ul>
        </div>
        <div>
            <h4 className="text-white text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
            <li><a href="#" className="hover:text-white transition">Help Center</a></li>
            <li><a href="#" className="hover:text-white transition">Safety Tips</a></li>
            <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
            </ul>
        </div>
        </>
    );
}
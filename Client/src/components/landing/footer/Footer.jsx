import React from 'react';
import FooterLinks from './FooterLinks';
import FooterSocial from './FooterSocial';
import Logo from '../navigation/Logo';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid md:grid-cols-4 gap-8">
            <div>
                <Logo />
                <p className="mt-4 text-sm">
                Connecting pet lovers and creating a community where every tail tells a story.
                </p>
            </div>
            <FooterLinks />
            <FooterSocial />
            </div>
            
            <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-center">
            <p>&copy; 2024 PetSphere. All rights reserved.</p>
            </div>
        </div>
        </footer>
    );
}
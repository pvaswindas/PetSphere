import React from 'react';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export default function FooterSocial() {
    return (
        <div>
        <h4 className="text-white text-lg font-semibold mb-4">Follow Us</h4>
        <div className="flex space-x-4">
            <a href="#" className="hover:text-white transition">
            <Facebook className="h-6 w-6" />
            </a>
            <a href="#" className="hover:text-white transition">
            <Twitter className="h-6 w-6" />
            </a>
            <a href="#" className="hover:text-white transition">
            <Instagram className="h-6 w-6" />
            </a>
            <a href="#" className="hover:text-white transition">
            <Youtube className="h-6 w-6" />
            </a>
        </div>
        </div>
    );
}
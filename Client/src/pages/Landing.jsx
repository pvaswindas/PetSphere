import React from 'react';
import TrustBadges from '../components/landing/trust/TrustBadges';
import NearbyServices from '../components/landing/services/NearbyServices';
import AuthCTA from '../components/landing/auth/AuthCTA';
import CallToAction from '../components/landing/cta/CallToAction';
import Footer from '../components/landing/footer/Footer';
import Hero from '../components/landing/hero/Hero';
import Navbar from '../components/landing/navigation/Navbar';
import Features from '../components/landing/features/Features';

function Landing() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main>
                <Hero />
                <Features />
                <TrustBadges />
                <NearbyServices />
                <AuthCTA />
                <CallToAction />
            </main>
            <Footer />
        </div>
    )
}

export default Landing
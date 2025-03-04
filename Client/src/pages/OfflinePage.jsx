import React from "react";
import { CloudOff, Wifi, RefreshCw } from 'lucide-react';
import { motion } from "framer-motion";

const OfflinePage = () => {
    const handleRetry = () => {
        window.location.reload();
    };

    return (
        <div className="h-screen bg-deep-ocean-blue-gradient flex flex-col items-center justify-center text-center p-6 relative overflow-hidden">
            {/* Background Floating Elements */}
            <motion.div 
                className="absolute top-10 left-10 w-40 h-40 bg-midnightBlue opacity-30 rounded-full blur-3xl"
                animate={{ y: [0, 15, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            />
            <motion.div 
                className="absolute bottom-10 right-10 w-32 h-32 bg-pastelBlue opacity-30 rounded-full blur-3xl"
                animate={{ y: [0, -15, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            />

            {/* Main Content */}
            <div className="flex-grow flex flex-col items-center justify-center">
                {/* Connection Status Animation */}
                <div className="relative flex justify-center mb-6">
                    <Wifi className="w-16 h-16 text-softSkyBlue opacity-50 animate-pulse absolute" />
                    <CloudOff className="w-16 h-16 text-white animate-spin-slow z-10" />
                </div>

                {/* Message */}
                <h2 className="text-2xl font-semibold text-white mb-4">Lost Connection</h2>
                <p className="text-lightTextGreyOpacity30 mb-6">
                    Oops! It seems you're offline. Please check your connection and try again.
                </p>

                {/* Button Wrapper for Centering Animation */}
                <div className="relative">
                    {/* Retry Button */}
                    <motion.button
                        onClick={handleRetry}
                        whileTap={{ scale: 0.95 }}
                        className="group flex items-center gap-2 bg-btn-primary-gradient text-white px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-lightGreen focus:ring-offset-2"
                    >
                        <RefreshCw className="w-5 h-5 group-hover:animate-spin" />
                        Try Again
                    </motion.button>

                    {/* Connection Waves (Now Originates from the Button) */}
                    <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <div className="absolute w-28 h-28 border-4 border-btn-secondary-gradient rounded-full animate-ping opacity-75"></div>
                        <div className="absolute w-28 h-28 border-4 border-softSkyBlue80 rounded-full animate-ping delay-300 opacity-50"></div>
                        <div className="absolute w-28 h-28 border-4 border-palePink rounded-full animate-ping delay-700 opacity-25"></div>
                    </motion.div>
                </div>
            </div>

            {/* Footer - Stays at the Bottom */}
            <motion.div 
                className="mt-auto text-lightTextGrey text-sm pb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
            >
                © 2025 PetSphere. All rights reserved.
            </motion.div>
        </div>
    );
};

export default OfflinePage;

import React from "react";
import { ServerCrash, AlertTriangle } from 'lucide-react';
import { motion } from "framer-motion";

const ServerDownPage = () => {

    return (
        <div className="h-screen bg-deep-ocean-blue-gradient flex flex-col items-center justify-center text-center p-6 relative overflow-hidden">
            {/* Main Content Wrapper */}
            <div className="flex-grow flex flex-col items-center justify-center">
                {/* Server Issue Animation */}
                <div className="relative flex justify-center mb-6">
                    <AlertTriangle className="w-16 h-16 text-softSkyBlue opacity-50 animate-pulse absolute" />
                    <ServerCrash className="w-16 h-16 text-white animate-bounce z-10" />
                </div>

                {/* Message */}
                <h2 className="text-2xl font-semibold text-white mb-4">Sorry, it's not you, it's us.</h2>
                <p className="text-lightTextGreyOpacity30 mb-6">
                    We have some trouble with the data. Please try to connect later.
                </p>
            </div>

            {/* Footer - Sticks to the bottom */}
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

export default ServerDownPage;

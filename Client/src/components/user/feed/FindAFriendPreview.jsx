import React from 'react'
import { motion } from "framer-motion";
import PetListingCard from './PetListingCard'
import Lottie from "lottie-react";
import animation1 from "../../../assets/lottie/Animation - 1739180112457.json";


function FindAFriendPreview({ petListings = [] }) {
    return (
        <div className='md:grid md:grid-cols-2 md:gap-3 space-y-5 md:space-y-0'>
            {petListings.length > 0 ? (
                petListings.map((listing, index) => (
                    <motion.div 
                        key={listing.id || index} 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ duration: 0.4 }}
                    >
                        <PetListingCard key={listing.id || index} listing={listing} />
                    </motion.div>
                ))
            ) : (
                <motion.div 
                    className="col-span-2 flex flex-col min-h-[34rem] items-center justify-center p-10"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Lottie animationData={animation1} className="w-60 h-60" loop />
                    <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mt-5">
                        No listings to find yet! 🐾 Check back later or add a new listing.
                    </h2>
                </motion.div>
            )}
        </div>
    )
}

export default FindAFriendPreview
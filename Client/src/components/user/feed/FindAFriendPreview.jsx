import React from 'react'
import PetListingCard from './PetListingCard'

function FindAFriendPreview({ petListings = [] }) {
    return (
        <div className='lg:grid lg:grid-cols-2 lg:gap-3 space-y-5 lg:space-y-0'>
            {petListings.length > 0 ? (
                petListings.map((listing, index) => (
                    <PetListingCard key={listing.id || index} listing={listing} />
                ))
            ) : (
                <div className="col-span-2 text-center text-gray-500 py-10">
                    No stories available
                </div>
            )}
        </div>
    )
}

export default FindAFriendPreview
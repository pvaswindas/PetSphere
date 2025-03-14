import React from 'react'
import { Clock, PawPrint, MapPin, IdCard } from 'lucide-react'
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";

function PetListingCard({ listing = [] }) {

    return (
        <div className='relative bg-white rounded-2xl h-[29rem] shadow-lg overflow-hidden'>
            <img
                src={listing?.images?.length > 0 && listing.images[0].image}
                alt={listing?.pet_name || "Pet Image"}
                className='w-full h-full object-cover lg:rounded-2xl'
            />
            <div className='absolute bottom-2 left-2 right-2 bg-white/70 rounded-xl p-4'>
                <div className='flex justify-between items-center'>
                    <h2 className='text-md text-black/80'>
                        {listing?.pet_name}
                    </h2>
                    <p className='flex gap-1 text-xs text-black/60'>
                        <MapPin size={15} color='red' />
                        {listing?.location.city && listing?.location.state 
                            ? `${listing.location.city}, ${listing.location.state}` 
                            : listing?.location.city || listing?.location.state || 'Location unavailable'}
                    </p>
                </div>
                <div className='flex text-xs text-blackOpacity40 justify-between items-center my-3'>
                    <p  className='flex gap-1'>
                        <PawPrint size={15} />
                        {listing?.pet_type ? `${listing.pet_type}` : "unknown"}
                    </p>
                    <p  className='flex gap-1 items-center'>
                        <IdCard size={15} />
                        {listing?.breed ? `${listing.breed}` : "unknown"}
                    </p>
                    <p  className='flex items-center'>
                        {listing?.gender === "female" ? 
                            (
                                <>
                                    <FemaleIcon sx={{ fontSize: 17 }} />
                                    Female
                                </>
                            ) : 
                            (
                                <>
                                    <MaleIcon sx={{ fontSize: 17 }} />
                                    Male
                                </>
                            )
                        }
                    </p>
                    <p className='flex gap-1'>
                        <Clock size={15} />
                        {listing?.age ? `${listing.age} ${listing.age === 1 ? "year" : "years"} old` : "Age unknown"}
                    </p>
                </div>
                <p className='text-sm text-black/70 truncate'>
                    {listing?.description ? `${listing.description}` : "unknown"}
                </p>
            </div>
        </div>
    )
}

export default PetListingCard
import React, { useState } from "react";

const getStatusClasses = (status) => {
    switch (status) {
        case "available":
            return "bg-green-500 text-white";
        case "sold":
            return "bg-red-500 text-white";
        case "not_available":
            return "bg-yellow-500 text-white";
        case "adoption":
            return "bg-blue-500 text-white";
        case "adopted":
            return "bg-blue-900 text-white";
        default:
            return "bg-gray-500 text-white";
    }
};

export function ExplorePetListings({petListings}) {
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

    const [searchLocation, setSearchLocation] = useState("");

    const handlePostClick = () => {
        
    };

    const filteredListings = petListings.filter((listing) => {
        const city = listing.location.city || '';
        return city.toLowerCase().includes(searchLocation.toLowerCase());
    });

    
    

    return (
        <div className="w-full">
            {/* Search Bar */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search by location"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                />
            </div>

            {filteredListings.length === 0 ? (
                <div className="w-full h-64 flex items-center justify-center rounded-lg px-5">
                    <p className="text-gray-500">No PetListings found in the specified location!</p>
                </div>
            ) : (
                <div className="grid gap-1 lg:gap-6 grid-cols-3">
                    {filteredListings.map((listing, index) => {
                        const status = listing.is_sold_or_adopted
                            ? listing.post_type === "Selling"
                                ? "sold"
                                : "adopted"
                            : !listing.is_available
                            ? "not_available"
                            : listing.post_type === "Adoption"
                            ? "adoption"
                            : "available";

                        return (
                            <div
                                key={index}
                                className="relative w-full aspect-square"
                                onClick={handlePostClick}
                            >
                                {/* Status Indicator Badge */}
                                <div
                                    className={`absolute top-0 left-0 text-[0.5rem] lg:text-xs font-bold rounded-br-lg 
                                        truncate max-w-[75%] sm:max-w-[60%] px-2 py-1 ${getStatusClasses(
                                            status
                                        )}`}
                                >
                                    {capitalize(status.replace("_", " "))}
                                </div>
                                <img
                                    src={listing.images[0].image}
                                    alt={`PetListing ${index + 1}`}
                                    className="w-full h-full lg:rounded-lg object-cover"
                                />
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

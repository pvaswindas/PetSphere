import React, { useState, useEffect } from "react";
import { X } from "lucide-react"; // Importing cross icon from lucide-react
import Shimmer from "../../Shimmer/Shimmer";

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

export function ExplorePetListings({ petListings }) {
    const [loading, setLoading] = useState(true);
    const [searchLocation, setSearchLocation] = useState("");
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

    const handlePostClick = () => {

    };

    const filteredListings = petListings.filter((listing) => {
        const city = listing.location.city || '';
        return city.toLowerCase().includes(searchLocation.toLowerCase());
    });

    useEffect(() => {
        if (petListings.length > 0) {
            setLoading(false);
        }
    }, [petListings]);

    return (
        <div className="w-full">
            {/* Search Bar */}
            <div className="mb-6 relative">
                <input
                    id="explore-location"
                    name="explore-location"
                    type="text"
                    placeholder="Search by location"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none pr-10"
                />
                {/* Clear button (cross) */}
                {searchLocation && (
                    <button
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={() => setSearchLocation("")}
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                )}
            </div>

            {loading || filteredListings.length === 0 ? (
                <div className="grid gap-0.5 grid-cols-4">
                    {Array.from({ length: 12 }).map((_, index) => (
                        <div
                            key={index}
                            className="relative w-full aspect-square"
                        >
                            <Shimmer className="w-full h-full" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid gap-0.5 grid-cols-4">
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
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

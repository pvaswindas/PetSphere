import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchPetListings } from "../../../../redux/thunks/PetListingThunk";
import Shimmer from "../../../Shimmer/Shimmer";
import AlertSnackbar from "../../../Snackbar/AlertSnackbar";

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

const PetListings = ({ username }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const petListings = useSelector((state) => state.petListings.petListings || []);
    const [loading, setLoading] = useState(true);

    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                dispatch(fetchPetListings(username));
            } catch (error) {
                setSnackbarMessage("Error fetching PetListings!")
                setSnackbarOpen(true)
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [dispatch, username]);

    const handlePostClick = () => {

    };

    return (
        <div className="lg:mx-4">
            <AlertSnackbar
                open={snackbarOpen}
                message={snackbarMessage}
                alert_type="error"
                onClose={() => setSnackbarOpen(false)}
            />
            {loading ? (
                <div className="grid grid-cols-3 gap-0.5 lg:gap-3">
                    {[...Array(6)].map((_, index) => (
                        <div key={index} className="relative w-full aspect-square">
                            {/* Shimmer Effect for Image */}
                            <Shimmer className="w-full h-full lg:rounded-lg" />
                            {/* Shimmer Effect for Status Badge */}
                            <div className="absolute top-0 left-0 px-2 py-1">
                                <Shimmer className="w-20 h-4 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : petListings?.length === 0 ? (
                <div className="w-full h-64 flex items-center justify-center rounded-lg px-5">
                    <p className="text-gray-500">No listings yet!</p>
                </div>
            ) : (
                <div className="grid grid-cols-3 gap-0.5 lg:gap-3">
                    {Array.isArray(petListings) &&
                        petListings
                            .slice()
                            .reverse()
                            .map((listing, index) => {
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
};

export default PetListings;

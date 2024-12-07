import React from "react";
import { useNavigate } from "react-router-dom";

const PostTypeModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate()

    if (!isOpen) return null;

    const handleSelect = (type) => {
        if (type === "PetStories") {
            navigate("/add-pet-story")
        } else if (type === "PetistiLngs") {
            navigate("/add-pet-listing")
        }
        onClose()
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start pt-16">
            <div className="bg-white rounded-lg shadow-xl p-6 w-96 mx-4 sm:mx-auto animate-fadeIn">
                {/* Header Section */}
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                        Choose Post Type
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 focus:outline-none text-xl"
                        aria-label="Close"
                    >
                        &times;
                    </button>
                </div>

                {/* Post Type Options */}
                <div className="space-y-4">
                    <div>
                        <button
                            onClick={() => handleSelect("PetStories")}
                            className="w-full py-2 bg-btn-primary-gradient text-white rounded-lg font-medium hover:bg-btn-hover-primary-gradient transition-transform transform hover:scale-105"
                        >
                            PetStories
                        </button>
                        <p className="text-xs text-center text-gray-600 mt-1">
                            Share stories, experiences, or updates about your pets.
                        </p>
                    </div>
                    <div>
                        <button
                            onClick={() => handleSelect("PetListings")}
                            className="w-full py-2 bg-btn-secondary-gradient text-white rounded-lg font-medium hover:bg-btn-hover-secondary-gradient transition-transform transform hover:scale-105"
                        >
                            PetListings
                        </button>
                        <p className="text-xs text-center text-gray-600 mt-1">
                            Create listings to sell or rehome your pets.
                        </p>
                    </div>
                </div>

                {/* Footer Section */}
                <button
                    onClick={onClose}
                    className="mt-6 w-full py-2 text-gray-600 bg-gray-100 rounded-lg hover:text-gray-800 hover:bg-gray-200 transition"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default PostTypeModal;

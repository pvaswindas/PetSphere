import { useState } from "react";

export const ContentArea = ({ post }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    const nextImage = () => {
        if (currentImageIndex < post.images.length - 1) {
            setCurrentImageIndex(currentImageIndex + 1);
        }
    };

    const prevImage = () => {
        if (currentImageIndex > 0) {
            setCurrentImageIndex(currentImageIndex - 1);
        }
    };

    return (
        <div className="flex-shrink-0 w-full lg:w-1/2 relative">
            {/* Display current image */}
            <img
                src={post.images[currentImageIndex].image}
                alt={post.content}
                className="w-full h-full lg:rounded-s-lg object-cover"
            />

            {/* Navigation buttons */}
            {currentImageIndex > 0 && (
                <button
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-3 rounded-full"
                    onClick={prevImage}
                    aria-label="Previous Image"
                >
                    <svg
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-3 h-3"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                </button>
            )}
            {currentImageIndex < post.images.length - 1 && (
                <button
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-3 rounded-full"
                    onClick={nextImage}
                    aria-label="Next Image"
                >
                    <svg
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-3 h-3"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </button>
            )}
        </div>
    )
}
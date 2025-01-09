import React from "react";

const Shimmer = ({ className }) => {
    return (
        <div className={`relative overflow-hidden bg-gray-100 ${className}`}>
            <div
                className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-300 to-gray-100 animate-shimmer"
            ></div>
        </div>
    );
};

export default Shimmer;

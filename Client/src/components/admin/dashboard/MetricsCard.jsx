import React from "react";

const MetricsCard = ({ title, children }) => {
    return (
        <div className="flex flex-col justify-center bg-white shadow-md p-4 h-[260px] rounded-3xl overflow-hidden">
            <h2 className="text-lg font-medium text-gray-800">{title}</h2>
            <div className="w-full flex-1 flex items-center justify-center">
                {children}
            </div>
        </div>
    );
};

export default MetricsCard;


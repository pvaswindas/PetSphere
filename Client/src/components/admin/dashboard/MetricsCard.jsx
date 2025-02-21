import React from "react";

const MetricsCard = ({ title, children }) => {
    return (
        <div className="flex flex-col justify-between bg-white shadow-md p-4 h-[260px] rounded-lg">
            <h2 className="text-lg font-medium text-gray-800">{title}</h2>
            <div className="h-48 flex justify-center items-center my-6">
                {children}
            </div>
        </div>
    );
};

export default MetricsCard;

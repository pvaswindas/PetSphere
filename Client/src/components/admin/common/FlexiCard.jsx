import React from "react"

const FlexiCard = ({ title, description, children }) => {
    return (
        <div className="bg-white shadow-lg flex flex-col rounded-3xl p-6 h-[500px] w-full">
            <h1 className="text-lg font-medium text-darkDenimBlue">{title}</h1>
            <p className="text-xs text-midnightBlue opacity-50">{description}</p>
            <div className="flex-grow overflow-y-auto max-h-[410px] mt-2 px-2">
                {children}
            </div>
        </div>
    );
};

export default FlexiCard;

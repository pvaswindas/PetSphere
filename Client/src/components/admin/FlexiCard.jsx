import React from "react"

const FlexiCard = ({title, description, children}) => {
    return (
        <div className="bg-white shadow-lg flex flex-col rounded-3xl py-4 px-6 h-[478px] w-full">
            <h1 className="text-lg font-medium text-darkDenimBlue">{title}</h1>
            <p className="text-xs text-midnightBlue opacity-50">{description}</p>
            <div>{children}</div>
        </div>
    )
}

export default FlexiCard

import React from "react";

function Button({
    type="button",
    text="Submit",
    onClick = () => {},
    isLoading = false,
    disabled = false,
    className = "",
    loadingText = "Loading...",
    backgroundColor = "bg-labelGreen",
    hoverBackgroundColor = "hover:bg-hoverGreen",
}) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={isLoading || disabled}
            className={`
                px-4 py-2 rounded-full text-white trasition-colors duration-300
                ${isLoading || disabled
                    ? "bg-gray-400 cursor-not-allowed"
                    : `${backgroundColor} ${hoverBackgroundColor}`}
                } ${className}
            `}
        >
            {isLoading ? loadingText : text}
        </button>
    )
}


export default Button;
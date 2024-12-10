import React from "react";

function Button({
    type="button",
    text="Submit",
    textColor = "text-white",
    rounded = "rounded-full",
    paddingx = "px-4",
    paddingy = "py-2",
    onClick = () => {},
    isLoading = false,
    disabled = false,
    isLoadingBackground = 'bg-labelGreen ',
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
                ${paddingx} ${paddingy} ${rounded} ${textColor} transition-colors duration-300
                ${isLoading || disabled
                    ? `${isLoadingBackground} cursor-not-allowed`
                    : `${backgroundColor} ${hoverBackgroundColor}`}
                } ${className}
            `}
        >
            {isLoading ? loadingText : text}
        </button>
    )
}

export default Button;

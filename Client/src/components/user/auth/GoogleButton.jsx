import React from "react";
import googleLogo from "../../../assets/auth/google-logo.svg"

function GoogleButton() {
    return (
        <button className="w-full bg-white border border-gray-300 rounded-full py-2 px-4 flex items-center justify-center gap-2 hover:shadow-md focus:outline-none">
            {/* Google logo */}
            <img src={googleLogo} alt="Google Logo" className="w-5 h-5" />
            
            {/* Button text */}
            <span className="text-labelGreen font-semibold">Sign in with Google</span>
        </button>
    );
}

export default GoogleButton;

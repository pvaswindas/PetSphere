import React from "react";
import { Link } from "react-router-dom";
import mainlogo from "../../../assets/logo/main-logo.png"

function AuthNavbar({
    link='/login',
    text='Login',
}) {
    return (
        <nav className="w-full py-4 px-6 flex justify-between items-center">
            {/* Left: Website Logo */}
            <div className="flex items-center">
                <img src={mainlogo} alt="Website Logo" className="h-10 w-auto" />
            </div>

            {/* Right: Navigation Links */}
            <div className="flex items-center space-x-4">
                <Link
                    to={link}
                    className="text-labelGreen hover:text-lightGreen font-medium transition-colors"
                >
                    {text}
                </Link>
            </div>
        </nav>
    );
}

export default AuthNavbar;

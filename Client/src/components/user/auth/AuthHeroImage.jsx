import React from "react";
import heroImage from "../../../assets/auth/heroImage.svg"

function AuthHeroImage() {
    return (
        <div 
            className="hidden lg:block w-1/2 bg-cover bg-white bg-center rounded-r-3xl"
            style={{ backgroundImage: `url(${heroImage})` }}
        ></div>
    );
}

export default AuthHeroImage;


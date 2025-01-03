import React from "react";
import plusMembership from "../../../assets/images/ad-preview/plus-membership1.svg"

const AdPreviewBar = () => {
    return (
        <aside className="w-full h-[168px] flex flex-col items-center bg-ad-preview-gradient shadow-md rounded-lg p-6 mb-4">
            {/* Ad View Bar content */}
            <img src={plusMembership} alt="" />
            <p className="text-palePink text-xs font-medium mt-6">Get more from PetSphere</p>
            <p className="text-palePink text-xs font-medium">with exclusive features.</p>
        </aside>
    );
};


export default AdPreviewBar;

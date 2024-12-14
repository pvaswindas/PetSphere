import React from "react";
import Navbar from "../../../components/user/Navbar/Navbar";
import Sidebar from "../../../components/user/sidebar/Sidebar";
import AdPreviewBar from "../../../components/user/sidebar/AdPreviewBox";
import EditProfileCard from "../../../components/user/Profile/EditProfileCard";

function EditProfile() {
    return (
        <div className="bg-whiteOpacity02 min-h-screen">
            {/* Navbar */}
            <Navbar />

            {/* Main Layout */}
            <div className="flex flex-col lg:flex-row lg:px-2 lg:py-6">
                {/* Sidebar Section */}
                <div className="hidden lg:flex flex-col space-y-4 lg:px-4 lg:w-1/5">
                    {/* ProfileViewBar */}
                    <AdPreviewBar />

                    {/* Sidebar */}
                    <Sidebar />
                </div>

                {/* Content Section */}
                <div className="flex-1 w-full lg:w-3/5 mx-auto lg:px-2 overflow-y-auto">
                    {/* Profile Card */}
                    <EditProfileCard />
                </div>
            </div>
        </div>
    );
}

export default EditProfile;

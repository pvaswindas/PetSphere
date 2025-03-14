import React from "react";
import Navbar from "../../../components/user/Navbar/Navbar";
import ProfileCard from "../../../components/user/Profile/ProfileCard";
import Sidebar from "../../../components/user/sidebar/Sidebar";
// import AdPreviewBar from "../../../components/user/sidebar/AdPreviewBox";
import Bottombar from "../../../components/user/bottombar/Bottombar";
import ProfileViewBar from "../../../components/user/sidebar/ProfileViewBar";

function Profile() {
    return (
        <div className="bg-white lg:bg-whiteOpacity02 min-h-screen flex flex-col overflow-hidden">
            {/* Navbar */}
            <Navbar />

            {/* Main Layout */}
            <div className="flex flex-grow lg:flex-row lg:px-2 lg:py-6 h-full">
                {/* Sidebar Section */}
                <div className="hidden lg:flex flex-col lg:px-4 lg:w-1/5 h-full">
                    <div className="space-y-4 h-full overflow-y-auto rounded-lg pb-12">
                        {/* AdPreviewBar */}
                        <ProfileViewBar />

                        {/* Sidebar */}
                        <Sidebar />
                    </div>
                </div>

                {/* Content Section - Allow only this to scroll */}
                <div className="flex-1 w-full lg:w-3/5 lg:mx-3 overflow-y-auto h-full lg:rounded-lg pb-12">
                    {/* Profile Card */}
                    <ProfileCard />
                </div>
            </div>

            {/* Bottombar */}
            <Bottombar />
        </div>
    );
}

export default Profile;

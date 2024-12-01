import React from "react";
import Navbar from "../../components/user/Navbar/Navbar";
import ProfileCard from "../../components/user/Profile/ProfileCard";
import Sidebar from "../../components/user/sidebar/Sidebar";
import ProfileViewBar from "../../components/user/sidebar/ProfileViewBar";

function Profile() {
    return (
        <div className="bg-whiteOpacity02 min-h-screen">
            {/* Navbar */}
            <Navbar />

            {/* Main Layout */}
            <div className="flex flex-col lg:flex-row px-4 py-6">
                {/* Sidebar Section */}
                <div className="hidden lg:flex flex-col space-y-4 lg:w-1/5">
                    {/* ProfileViewBar */}
                    <ProfileViewBar />

                    {/* Sidebar */}
                    <Sidebar />
                </div>

                {/* Content Section */}
                <div className="flex-1 lg:w-3/5 mx-auto lg:px-6">
                    {/* Profile Card */}
                    <ProfileCard
                        coverImage="https://via.placeholder.com/1200x400"
                        profileImage="https://via.placeholder.com/150"
                        name="Jane Doe"
                        bio="Welcome to my profile! This section is for a detailed bio, social links, and more information about me."
                    />
                </div>
            </div>
        </div>
    );
}

export default Profile;

import React from "react";
import Navbar from "../../components/user/Navbar/Navbar";
import Sidebar from "../../components/user/sidebar/Sidebar";
import ProfileViewBar from "../../components/user/sidebar/ProfileViewBar";
import AddPetStoryCard from "../../components/user/post/AddPetStoryCard";

function AddPetStory() {
    return (
        <div className="bg-whiteOpacity02 min-h-screen">
            {/* Navbar */}
            <Navbar />

            {/* Main Layout */}
            <div className="flex flex-col lg:flex-row lg:px-2 lg:py-6">
                {/* Sidebar Section */}
                <div className="hidden lg:flex flex-col space-y-4 lg:px-4 lg:w-1/5">
                    {/* ProfileViewBar */}
                    <ProfileViewBar />

                    {/* Sidebar */}
                    <Sidebar />
                </div>

                {/* Content Section */}
                <div className="flex-1 w-full lg:w-3/5 mx-auto lg:px-2 overflow-y-auto">
                    {/* Profile Card */}
                    <AddPetStoryCard />
                </div>
            </div>
        </div>
    );
}

export default AddPetStory;

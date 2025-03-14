import React from "react"
import Navbar from "../../../components/user/Navbar/Navbar"
import Sidebar from "../../../components/user/sidebar/Sidebar"
import ProfileViewBar from "../../../components/user/sidebar/ProfileViewBar"
import AddPetStoryCard from "../../../components/user/post/AddPetStoryCard"

function AddPetStory() {
    return (
        <div className="bg-white lg:bg-whiteOpacity02 min-h-screen flex flex-col overflow-hidden">
            {/* Navbar */}
            <Navbar />

            {/* Main Layout */}
            <div className="flex flex-col lg:flex-row lg:px-2 lg:py-6">
                {/* Sidebar Section */}
                <div className="hidden lg:flex flex-col lg:px-4 lg:w-1/5">
                    <div className="space-y-4 h-[calc(100vh-56px)] overflow-y-auto rounded-lg pb-12">
                        {/* AdPreviewBar */}
                        <ProfileViewBar />

                        {/* Sidebar */}
                        <Sidebar />
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 w-full lg:w-3/5 lg:mx-3 overflow-y-auto h-[calc(100vh-56px)] lg:rounded-lg pb-12">
                    {/* Profile Card */}
                    <AddPetStoryCard />
                </div>
            </div>
        </div>
    )
}

export default AddPetStory

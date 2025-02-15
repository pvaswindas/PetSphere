import React from "react"
import Navbar from "../../components/user/Navbar/Navbar"
import Sidebar from "../../components/user/sidebar/Sidebar"
// import AdPreviewBar from "../../components/user/sidebar/AdPreviewBox"
import { ExploreComponent } from "../../components/user/explore/Explore"
import Bottombar from "../../components/user/bottombar/Bottombar"
import ProfileViewBar from "../../components/user/sidebar/ProfileViewBar"

function ExplorePage() {
    return (
        <div className="bg-white lg:bg-whiteOpacity02 h-screen flex flex-col overflow-hidden">
            {/* Navbar */}
            <Navbar />

            {/* Main Layout */}
            <div className="flex flex-col lg:flex-row lg:px-2 lg:py-6">
                {/* Sidebar Section */}
                <div className="hidden lg:flex flex-col lg:px-4 lg:w-1/5">
                    <div className="space-y-4 lg:h-[calc(100vh-56px)] lg:overflow-y-auto rounded-lg pb-12">
                        {/* ProfileViewBar */}
                        <ProfileViewBar />

                        {/* Sidebar */}
                        <Sidebar />
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 w-full lg:w-3/5 lg:mx-3 lg:overflow-y-auto lg:h-[calc(100vh-56px)] lg:rounded-lg pb-12">
                    {/* Explore Card */}
                    <ExploreComponent />
                </div>
            </div>
            {/* Bottombar */}
            <Bottombar />
        </div>
    )
}

export default ExplorePage

import React from "react"
import Navbar from "../../../components/user/Navbar/Navbar"
import Sidebar from "../../../components/user/sidebar/Sidebar"
// import AdPreviewBar from "../../../components/user/sidebar/AdPreviewBox"
import Bottombar from "../../../components/user/bottombar/Bottombar"
import ProfileViewBar from "../../../components/user/sidebar/ProfileViewBar"
import ListingDisplayCard from "../../../components/user/post/ListingDisplayCard"

function ListingDisplay() {
    return (
        <div className="bg-white lg:bg-whiteOpacity02 min-h-screen flex flex-col overflow-hidden">
            {/* Navbar */}
            <Navbar />

            {/* Main Layout */}
            <div className="flex flex-col lg:flex-row lg:px-2 lg:py-6">
                {/* Sidebar Section */}
                <div className="hidden lg:flex flex-col lg:px-4 lg:w-1/5">
                    <div className="space-y-4 h-[calc(100vh-56px)] overflow-y-auto rounded-lg pb-12">
                        {/* ProfileViewBar */}
                        <ProfileViewBar />

                        {/* Sidebar */}
                        <Sidebar />
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 w-full lg:w-3/5 lg:mx-3 overflow-y-auto h-[calc(100vh-56px)] lg:rounded-lg pb-12">
                    {/* Profile Card */}
                    <ListingDisplayCard />
                </div>
            </div>
            {/* Bottombar */}
            <Bottombar />
        </div>
    )
}

export default ListingDisplay

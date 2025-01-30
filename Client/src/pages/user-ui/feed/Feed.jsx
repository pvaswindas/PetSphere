import React, { Suspense, useState } from 'react'
import Navbar from '../../../components/user/Navbar/Navbar'
import AdPreviewBar from '../../../components/user/sidebar/AdPreviewBox'
import Bottombar from '../../../components/user/bottombar/Bottombar'
import Sidebar from '../../../components/user/sidebar/Sidebar'
import HomePreview from '../../../components/user/feed/HomePreview'
import MessageBar from '../../../components/user/sidebar/MessageBar'
import FindAFriendPreview from '../../../components/user/feed/FindAFriendPreview'
import Shimmer from '../../../components/Shimmer/Shimmer'
import FeedSelection from '../../../components/user/feed/FeedSelection'


function Feed() {

    const [selectedFeed, setSelectedFeed] = useState("Home")

    const renderSelectedFeed = () => {
        switch (selectedFeed) {
            case "Home":
                return <HomePreview />
            case "FindAFriend":
                return <FindAFriendPreview />
            default:
                return <HomePreview />
        }
    }

    return (
        <div className="bg-white lg:bg-whiteOpacity02 min-h-screen flex flex-col">
            {/* Navbar */}
            <Navbar />

            {/* Main Layout */}
            <div className="flex flex-grow lg:flex-row lg:px-2 lg:py-6">
                {/* Start Sidebar Section */}
                <div className="hidden lg:flex flex-col lg:px-4 lg:w-1/5">
                    <div className="space-y-4 h-[calc(100vh-56px)] overflow-y-auto rounded-lg pb-12">
                        {/* AdPreviewBar */}
                        <AdPreviewBar />

                        {/* Sidebar */}
                        <Sidebar />
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 w-full lg:w-3/5 lg:mx-3 overflow-y-auto h-[calc(100vh-56px)] lg:rounded-lg pb-12">
                    <div className='align-top w-full'>
                        <FeedSelection selectedFeed={selectedFeed} setSelectedFeed={setSelectedFeed} />
                    </div>

                    {/* Feed */}
                    <Suspense
                        fallback={
                            <div className="grid grid-cols-2 gap-0.5 lg:gap-3">
                                {[...Array(6)].map((_, index) => (
                                    <div key={index} className="relative w-full aspect-square">
                                        {/* Shimmer Effect for Image */}
                                    </div>
                                ))}
                            </div>
                        }>
                        {renderSelectedFeed()}
                    </ Suspense>
                </div>

                {/* End Sidebar Section */}
                <div className="hidden lg:flex flex-col lg:px-4 lg:w-1.5/5">
                    <div className="space-y-4 h-[calc(100vh-56px)] overflow-y-auto rounded-lg pb-12">
                        {/* MessageBar */}
                        <MessageBar />
                    </div>
                </div>
            </div>
            {/* Bottombar */}
            <Bottombar />
        </div>
    )
}

export default Feed
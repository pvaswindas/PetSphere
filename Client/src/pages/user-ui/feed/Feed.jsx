import React, { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import Navbar from '../../../components/user/Navbar/Navbar'
import AdPreviewBar from '../../../components/user/sidebar/AdPreviewBox'
import Bottombar from '../../../components/user/bottombar/Bottombar'
import Sidebar from '../../../components/user/sidebar/Sidebar'
import MessageBar from '../../../components/user/sidebar/MessageBar'
import Shimmer from '../../../components/Shimmer/Shimmer'
import FeedSelection from '../../../components/user/feed/FeedSelection'
import { getMarketPlace, getUserFeed } from '../../../utils/feedUtils'
import AlertSnackbar from '../../../components/Snackbar/AlertSnackbar'


const HomePreview = lazy(() => import('../../../components/user/feed/HomePreview'));
const FindAFriendPreview = lazy(() => import('../../../components/user/feed/FindAFriendPreview'));

function Feed() {
    const [selectedFeed, setSelectedFeed] = useState("Home")
    const [isLoading, setIsLoading] = useState(true)

    const [snackbarMessage, setSnackbarMessage] = useState("")
    const [snackbarOpen, setSnackbarOpen] = useState(false)

    const [pawStories, setPawStories] = useState([])
    const [petListings, setPetListings] = useState([])

    const renderShimmer = () => {
        return (
            <div className="lg:grid lg:grid-cols-2 gap-0.5 lg:gap-3">
                {[...Array(6)].map((_, index) => (
                    <div key={index} className="relative w-full lg:rounded-lg aspect-square">
                        <Shimmer className="w-full h-full lg:rounded-lg" />
                    </div>
                ))}
            </div>
        )
    }

    const renderSelectedFeed = () => {
        if (isLoading) return renderShimmer();

        return (
            <Suspense fallback={renderShimmer()}>
                {selectedFeed === "Home" ? (
                    <HomePreview pawStories={pawStories} />
                ) : (
                    <FindAFriendPreview petListings={petListings} />
                )}
            </Suspense>
        );
    };  

    const fetchFeed = useCallback(async () => {
        setIsLoading(true);
        try {
            if (selectedFeed === "Home") {
                setPawStories(await getUserFeed());
            } else {
                setPetListings(await getMarketPlace());
            }
        } catch (error) {
            setSnackbarMessage("Oops! Something went wrong");
            setSnackbarOpen(true);
        } finally {
            setIsLoading(false);
        }
    }, [selectedFeed]);

    useEffect(() => {
        fetchFeed()
    }, [fetchFeed])

    return (
        <div className="bg-white lg:bg-whiteOpacity02 min-h-screen flex flex-col h-screen overflow-hidden">
            <AlertSnackbar
                open={snackbarOpen}
                message={snackbarMessage}
                alert_type="error"
                onClose={() => setSnackbarOpen(false)}
            />
            {/* Navbar */}
            <Navbar />
    
            {/* Main Layout */}
            <div className="flex flex-grow lg:flex-row md:px-2 md:py-6 h-full">
                {/* Start Sidebar Section */}
                <div className="hidden lg:flex flex-col lg:px-4 lg:w-1/5">
                    <div className="space-y-4 h-full overflow-y-auto rounded-lg pb-12">
                        {/* AdPreviewBar */}
                        <AdPreviewBar />
                        {/* Sidebar */}
                        <Sidebar />
                    </div>
                </div>
    
                {/* Content Section - Make this scrollable */}
                <div className="flex-1 w-full lg:w-3/5 lg:mx-3 overflow-y-auto h-full lg:rounded-lg pb-12">
                    <div className='sticky top-0 z-10'>
                        <FeedSelection selectedFeed={selectedFeed} setSelectedFeed={setSelectedFeed} />
                    </div>
    
                    {/* Feed */}
                    {renderSelectedFeed()}
                </div>
    
                {/* End Sidebar Section */}
                <div className="hidden lg:flex flex-col lg:px-4 lg:w-1.5/5">
                    <div className="space-y-4 h-full overflow-y-auto rounded-lg pb-12">
                        {/* MessageBar */}
                        <MessageBar />
                    </div>
                </div>
            </div>
    
            {/* Bottombar */}
            <Bottombar />
        </div>
    );
    
}

export default Feed
import React, { useState, lazy, memo, useEffect, Suspense } from "react"
import ProfileFeedSelection from "./ProfileFeedSelection"
import UserInfo from "./UserInfo"
import ProfileHeader from "./ProfileHeader"
import { useDispatch, useSelector } from "react-redux"
import { fetchProfile } from "../../../redux/thunks/ProfileThunk"
import Shimmer from "../../Shimmer/Shimmer"
import { useParams } from "react-router-dom"

const PawStories = lazy(() => import("./Content/PawStories"))
const PetListings = lazy(() => import("./Content/PetListings"))
const PetPals = lazy(() => import("./Content/PetPals"))
const Friends = lazy(() => import("./Content/Friends"))
const Badges = lazy(() => import("./Content/Badges"))


const ProfileCard = memo(() => {
    const [selectedFeed, setSelectedFeed] = useState("PawStories");
    const dispatch = useDispatch();
    const { username } = useParams();
    
    const profile = useSelector((state) => state.profile.profile_data);
    const userProfile = useSelector((state) => state.profile.other_users_profile?.[username]);

    const isCurrentUser = profile?.user?.username === username;
    const currentProfile = isCurrentUser ? profile : userProfile || null;

    useEffect(() => {
        if (username && !userProfile && profile?.user?.username) {
            dispatch(fetchProfile({ auth_username: profile.user.username, username }));
        }
    }, [dispatch, username, profile?.user?.username, userProfile]);

    const renderSelectedFeed = () => {
        switch (selectedFeed) {
            case "PawStories":
                return <PawStories username={username} />;
            case "PetListings":
                return <PetListings username={username} />;
            case "PetPals":
                return <PetPals />;
            case "Friends":
                return <Friends username={username} />;
            case "Badges":
                return <Badges />;
            default:
                return <PawStories />;
        }
    };

    return (
        <div className="w-full bg-white lg:rounded-lg lg:shadow-md overflow-hidden mb-1">
            {/* Profile Header */}
            {!currentProfile && <Shimmer className="w-full h-full lg:rounded-s-lg" />}
            {currentProfile && (
                <>
                    <ProfileHeader profile={currentProfile} isCurrentUser={isCurrentUser} />
    
                    {/* User Info */}
                    <UserInfo profile={currentProfile} isCurrentUser={isCurrentUser} />
    
                    <div className="px-1 lg:px-8">
                        <hr className="border-t-2 border-lightTextGreyOpacity30 hidden lg:flex lg:my-4" />
                    </div>
    
                    {/* Feed Selection */}
                    <ProfileFeedSelection selectedOption={selectedFeed} onSelectOption={setSelectedFeed} />
    
                    {/* Feed Content */}
                    <div className="lg:px-4 lg:pt-4 lg:pb-8">
                        <Suspense fallback={<Shimmer className="w-full h-full lg:rounded-s-lg" />}>
                            {renderSelectedFeed()}
                        </Suspense>
                    </div>
                </>
            )}
        </div>
    );    
});

export default ProfileCard

import React, { useState, lazy, Suspense, memo } from "react";
import ProfileFeedSelection from "./ProfileFeedSelection";
import UserInfo from "./UserInfo";
import ProfileHeader from "./ProfileHeader";
const PawStories = lazy(() => import("./Content/PawStories"));
const PetListings = lazy(() => import("./Content/PetListings"));
const PetPals = lazy(() => import("./Content/PetPals"));
const Friends = lazy(() => import("./Content/Friends"));
const Badges = lazy(() => import("./Content/Badges"));

const ProfileCard = memo(() => {
    const [selectedFeed, setSelectedFeed] = useState("PawStories");

    const renderSelectedFeed = () => {
        switch (selectedFeed) {
            case "PawStories":
                return <PawStories />
            case "PetListings":
                return <PetListings />
            case "PetPals":
                return <PetPals />
            case "Friends":
                return <Friends />
            case "Badges":
                return <Badges />
            default:
                return <PawStories />
        }
    };

    return (
        <div className="w-full bg-white lg:rounded-lg shadow-md overflow-hidden mb-1">
            {/* Profile Header */}
            <ProfileHeader />

            {/* User Info */}
            <UserInfo />
            <div className="px-1 lg:px-8">
                <hr className="border-t-2 border-lightTextGreyOpacity30 hidden lg:flex lg:my-4" />
            </div>
            {/* Feed Selection */}
            <ProfileFeedSelection
                selectedOption={selectedFeed}
                onSelectOption={setSelectedFeed}
            />

            {/* Feed Content */}
            <div className="lg:px-4 lg:pt-4 lg:pb-8">
                <Suspense fallback={<div>Loading...</div>}>
                    {renderSelectedFeed()}
                </Suspense>
            </div>
        </div>
    );
});

export default ProfileCard;

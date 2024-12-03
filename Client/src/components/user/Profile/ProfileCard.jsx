import React, { useState } from "react";
import ProfileFeedSelection from "./ProfileFeedSelection";
import UserInfo from "./UserInfo";
import ProfileHeader from "./ProfileHeader";
import PawStories from "./Content/PawStories";
import PetListings from "./Content/PetListings";
import PetPals from "./Content/PetPals";
import Badges from "./Content/Badges";
import Friends from "./Content/Friends";

const ProfileCard = () => {
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
            <div className="lg:px-4 lg:pt-4 lg:pb-8">{renderSelectedFeed()}</div>
        </div>
    );
};

export default ProfileCard;

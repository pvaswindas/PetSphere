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
    const [selectedFeed, setSelectedFeed] = useState("PawStories")
    const dispatch = useDispatch()

    const profile = useSelector((state) => state.profile.profile_data)
    const user = profile ? profile.user : null

    const { username } = useParams()

    useEffect(() => {
        let newusername = username
        if (!newusername) {
            newusername = user.username
        }
        dispatch(fetchProfile({ auth_username: user.username, username }))
    }, [dispatch, username, user.username])


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
    }

    return (
        <div className="w-full bg-white lg:rounded-lg lg:shadow-md overflow-hidden mb-1">
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
                    <Suspense
                        fallback={
                            <div className="grid grid-cols-3 gap-0.5 lg:gap-3">
                                {[...Array(6)].map((_, index) => (
                                    <div key={index} className="relative w-full aspect-square">
                                        {/* Shimmer Effect for Image */}
                                        <Shimmer className="w-full h-full lg:rounded-lg" />
                                        {/* Shimmer Effect for Status Badge */}
                                    </div>
                                ))}
                            </div>
                        }>
                        {renderSelectedFeed()}
                    </ Suspense>
                </div>
        </div>
    )
})

export default ProfileCard

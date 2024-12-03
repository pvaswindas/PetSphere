import React from 'react'
import { useSelector } from 'react-redux'
import editIcon from "../../../assets/icon/edit-icon.svg"

const ProfileHeader = () => {
    const user = useSelector((state) => state.auth.user_data)
    const profile = useSelector((state) => state.profile.profile_data)

    return (
        <div className="relative">
            {/* Cover Image */}
            {profile?.cover_image ? (
                <img
                    src={profile.cover_image}
                    alt="Cover"
                    className="w-full h-[200px] object-cover"
                />
            ) : (
                <div className="w-full h-[130px] lg:h-[280px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
            )}

            {/* Edit Icon */}
            <div className="absolute top-4 right-4 cursor-pointer">
                <img 
                    src={editIcon} 
                    alt="Edit" 
                    className="w-4 h-4 lg:w-6 lg:h-6"
                    onClick={() => console.log("Edit Cover Image")} 
                />
            </div>

            {/* Profile Image */}
            <div className="absolute bottom-[-50px] left-4 lg:left-8">
                {user?.profile_picture ? (
                    <img
                        src={user.profile_picture}
                        alt="Profile"
                        className="w-[100px] h-[100px] rounded-full border-4 border-white object-cover"
                    />
                ) : (
                    <div className="w-[100px] h-[100px] lg:w-[110px] lg:h-[110px] rounded-full border-4 border-white bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-600 font-bold text-lg"></span>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProfileHeader

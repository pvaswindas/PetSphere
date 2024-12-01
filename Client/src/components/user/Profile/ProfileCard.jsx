import React from "react";
import { useSelector } from "react-redux";

const ProfileCard = () => {
    const profile = useSelector((state) => state.profile.profile);

    return (
        <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
            {/* Cover Image */}
            <div className="relative">
                {profile?.coverImage ? (
                    <img
                        src={profile.coverImage}
                        alt="Cover"
                        className="w-full h-[200px] object-cover"
                    />
                ) : (
                    <div className="w-full h-[200px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                )}

                {/* Profile Image */}
                <div className="absolute bottom-[-50px] left-8">
                    {profile?.profile_picture ? (
                        <img
                            src={profile.profile_picture}
                            alt="Profile"
                            className="w-[100px] h-[100px] rounded-full border-4 border-white object-cover"
                        />
                    ) : (
                        <div className="w-[100px] h-[100px] rounded-full border-4 border-white bg-gray-300 flex items-center justify-center">
                            <span className="text-gray-600 font-bold text-lg"></span>
                        </div>
                    )}
                </div>
            </div>

            {/* Info Section */}
            <div className="pt-12 px-8 pb-6">
                <h2 className="text-xl font-bold text-gray-800">{profile?.name || "John Doe"}</h2>
                <p className="text-sm text-gray-600 mt-2">{profile?.bio || "This is a brief bio about the user. Add more details here to demonstrate how the card adjusts its height."}</p>
                <div className="mt-6 flex justify-end space-x-4">
                    <button className="px-6 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition">
                        Follow
                    </button>
                    <button className="px-6 py-2 bg-gray-100 text-gray-800 text-sm rounded-md hover:bg-gray-200 transition">
                        Message
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;

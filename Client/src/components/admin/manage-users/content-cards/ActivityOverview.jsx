import React from 'react';
import { formatDateTime } from '../../../../utils/admin-utils/formatDate';

function ActivityOverview({ profile }) {
    return (
        <div className="bg-softSkyBlue h-64 lg:bg-white lg:shadow-lg rounded-xl p-4 lg:hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                Activity Overview
            </h2>
            <div className="grid grid-cols-2 gap-4 text-center">
                {/* PawStories */}
                <div className="bg-white/60 lg:bg-softSkyBlue rounded-lg p-1 shadow-sm">
                    <p className="text-xs font-medium text-gray-600">PawStories</p>
                    <p className="text-md font-bold text-gray-800">{profile?.pawstory_count || 0}</p>
                </div>
                {/* PetListings */}
                <div className="bg-white/60 lg:bg-softSkyBlue rounded-lg p-1 shadow-sm">
                    <p className="text-xs font-medium text-gray-600">PetListings</p>
                    <p className="text-md font-bold text-gray-800">{profile?.petlisting_count || 0}</p>
                </div>
                {/* Followers */}
                <div className="bg-white/60 lg:bg-softSkyBlue rounded-lg p-1 shadow-sm">
                    <p className="text-xs font-medium text-gray-600">Followers</p>
                    <p className="text-md font-bold text-gray-800">{profile?.follower_count || 0}</p>
                </div>
                {/* Following */}
                <div className="bg-white/60 lg:bg-softSkyBlue rounded-lg p-1 shadow-sm">
                    <p className="text-xs font-medium text-gray-600">Following</p>
                    <p className="text-md font-bold text-gray-800">{profile?.following_count || 0}</p>
                </div>
                {/* Last Active */}
                <div className="col-span-2 bg-white/60 lg:bg-softSkyBlue rounded-lg p-1 shadow-sm">
                    <p className="text-xs font-medium text-gray-600">Last Login</p>
                    <p className="text-smj font-bold text-gray-800">
                        {profile?.user.last_login ? formatDateTime(profile?.user.last_login) : "Not available"}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ActivityOverview;

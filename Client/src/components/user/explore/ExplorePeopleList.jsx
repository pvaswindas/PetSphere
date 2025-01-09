import React from "react";
import userAvatar from "../../../assets/icon/user-avatar.svg"

export function ExplorePeopleList({ people }) {

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {people?.map((profile) => (
                <div key={profile?.id} className="p-4 border border-gray-300 rounded-lg shadow-sm">
                    <div className="flex items-center gap-4">
                        <img
                            src={profile?.profile_picture || userAvatar}
                            alt={profile?.user.name}
                            className="h-12 w-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                            <h3 className="font-semibold">{profile?.user.name}</h3>
                            <p className="text-sm text-gray-500">{profile?.user.username}</p>
                            <p className="text-sm text-gray-500">{profile?.mutualFriends} mutual friends</p>
                        </div>
                        <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm">
                            Follow
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

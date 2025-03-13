import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import userAvatar from "../../../assets/icon/user-avatar.svg"
import { fetchProfile } from "../../../redux/thunks/ProfileThunk";

const ProfileViewBar = () => {
    const profile = useSelector((state) => state.profile.profile_data)
    const user = profile ? profile.user : null
    const username = user.username

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleOnClick = () => {
        navigate('/profile/edit');
    };

    const countsTextStyle = "text-[12px] font-medium text-blackOpacity70"


    useEffect(() => {
        if (username) {
            dispatch(fetchProfile({ auth_username: username, username }));
        }
    }, [dispatch, username]);

    return (
        <aside 
            className="w-full h-[168px] bg-white shadow-md rounded-lg mb-4 relative"
            onClick={handleOnClick}
        >
            {/* Cover Image */}
            {profile?.cover_image ? (
                <img
                    src={ profile.cover_image }
                    alt="Cover"
                    className="w-full h-[60px] object-cover"
                />
            ) : (
                <div className="w-full h-[60px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
            )}

            <div className="flex flex-col justify-center items-center relative">
                <img
                    src={profile?.profile_picture || userAvatar}
                    alt="Profile"
                    className="w-12 h-12 rounded-full border-2 border-white object-cover mt-[-30px]"
                />
                <h2 className="font-medium text-[12px] text-blackOpacity85">{user?.name || "Anonymous User"}</h2>
                <p className="text-[10px] text-blackOpacity70">@{user?.username || "user"}</p>
            </div>

            <div className="flex justify-between px-8 mt-2">
                <div className="flex flex-col items-center">
                    <p className={countsTextStyle}>{profile.follower_count ? profile?.follower_count : 0}</p>
                    <p className={countsTextStyle}>followers</p>
                </div>
                <div className="flex flex-col items-center">
                    <p className={countsTextStyle}>{profile.following_count ? profile?.following_count : 0}</p>
                    <p className={countsTextStyle}>following</p>
                </div>
                <div className="flex flex-col items-center">
                    <p className={countsTextStyle}>{profile.pawstory_count ? profile?.pawstory_count : 0}</p>
                    <p className={countsTextStyle}>posts</p>
                </div>
            </div>
        </aside>
    );
};

export default ProfileViewBar;

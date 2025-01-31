import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import activeHomeIcon from "../../../assets/icon/user-sidebar/home-icon-white.svg"
import activeListingIcon from "../../../assets/icon/user-sidebar/pet-carrier-icon-white.svg"
import activeExploreIcon from "../../../assets/icon/user-sidebar/explore-icon-white.svg"
import activeMessageIcon from "../../../assets/icon/user-sidebar/message-icon-white.svg"
import activeProfileIcon from "../../../assets/icon/user-sidebar/profile-icon-white.svg"
import activeNearbyIcon from "../../../assets/icon/user-sidebar/nearby-icon-white.svg"
import activeSettingsIcon from "../../../assets/icon/user-sidebar/settings-icon-white.svg"

import nonActiveHomeIcon from "../../../assets/icon/user-sidebar/home-icon.svg"
import nonActiveListingIcon from "../../../assets/icon/user-sidebar/pet-carrier-icon.svg"
import nonActiveExploreIcon from "../../../assets/icon/user-sidebar/explore-icon.svg"
import nonActiveMessageIcon from "../../../assets/icon/user-sidebar/message-icon.svg"
import nonActiveProfileIcon from "../../../assets/icon/user-sidebar/profile-icon.svg"
import nonActiveNearbyIcon from "../../../assets/icon/user-sidebar/nearby-icon.svg"
import nonActiveSettingsIcon from "../../../assets/icon/user-sidebar/settings-icon.svg"
import { useSelector } from "react-redux";


function NavigationPanel(){
    const location = useLocation()
    const navigate = useNavigate()

    const isActive = (path) => location.pathname.startsWith(path)
    const profile = useSelector((state) => state.profile?.profile_data || null);

    const ifActive = "bg-og-gradient text-white";
    const ifNonActive = "bg-white text-blackOpacity70";
    const h2CommonStyle = "text-sm font-medium"
    const buttonCommonStyle = "flex gap-2 items-center w-full justify-start py-2 px-5 hover:scale-105 transition-transform duration-300 h-[38px] rounded-md"


    const handleNavigate = (path) => {
        if (location.pathname !== `/${path}`){
            navigate(`/${path}`)
        }
    }

    return (
        <div className="navigation-panel flex flex-col gap-2">
                {/* Feed Button */}
                <button
                    className={`${buttonCommonStyle} ${ isActive('/feed') ? ifActive : ifNonActive }`}
                    onClick={() => handleNavigate("feed")}
                >
                    <img
                        src={isActive('/feed') ? activeHomeIcon : nonActiveHomeIcon}
                        alt="profile"
                        className="w-[13px]"
                    />
                    <h2 className={h2CommonStyle}>Feed</h2>
                </button>

                {/* Explore Button */}
                <button
                    className={`${buttonCommonStyle} ${ isActive('/explore') ? ifActive : ifNonActive }`}
                    onClick={() => handleNavigate("explore")}
                >
                    <img
                        src={isActive('/explore') ? activeExploreIcon : nonActiveExploreIcon}
                        alt="profile"
                        className="w-[13px]"
                    />
                    <h2 className={h2CommonStyle}>Explore</h2>
                </button>

                {/* Messages Button */}
                <button
                    className={`${buttonCommonStyle} ${ isActive('/messages') ? ifActive : ifNonActive }`}
                    onClick={() => handleNavigate("messages")}
                >
                    <img
                        src={isActive('/messages') ? activeMessageIcon : nonActiveMessageIcon}
                        alt="profile"
                        className="w-[13px]"
                    />
                    <h2 className={h2CommonStyle}>Messages</h2>
                </button>

                {/* My Profile Button */}
                <button
                    className={`${buttonCommonStyle} ${ isActive('/profile') ? ifActive : ifNonActive }`}
                    onClick={() => handleNavigate(`profile/${profile.user.username}`)}
                >
                    <img
                        src={isActive('/profile') ? activeProfileIcon : nonActiveProfileIcon}
                        alt="profile"
                        className="w-[13px]"
                    />
                    <h2 className={h2CommonStyle}>My Profile</h2>
                </button>

                {/* Nearby Services Button */}
                {/* <button
                    className={`${buttonCommonStyle} ${ isActive('/nearby-services') ? ifActive : ifNonActive }`}
                >
                    <img
                        src={isActive('/nearby-services') ? activeNearbyIcon : nonActiveNearbyIcon}
                        alt="profile"
                        className="w-[13px]"
                    />
                    <h2 className={h2CommonStyle}>Nearby Services</h2>
                </button> */}

                {/* Settings Button */}
                <button
                    className={`${buttonCommonStyle} ${ isActive('/settings') ? ifActive : ifNonActive }`}
                >
                    <img
                        src={isActive('/settings') ? activeSettingsIcon : nonActiveSettingsIcon}
                        alt="profile"
                        className="w-[13px]"
                    />
                    <h2 className={h2CommonStyle} >Settings</h2>
                </button>
            </div>
    )
}

export default NavigationPanel;
import React from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import activeHomeIcon from "../../../assets/icon/user-sidebar/home-icon-white.svg";
import activeExploreIcon from "../../../assets/icon/user-sidebar/explore-icon-white.svg";
import activeMessageIcon from "../../../assets/icon/user-sidebar/message-icon-white.svg";
import activeProfileIcon from "../../../assets/icon/user-sidebar/profile-icon-white.svg";

import nonActiveHomeIcon from "../../../assets/icon/user-sidebar/home-icon.svg";
import nonActiveExploreIcon from "../../../assets/icon/user-sidebar/explore-icon.svg";
import nonActiveMessageIcon from "../../../assets/icon/user-sidebar/message-icon.svg";
import nonActiveProfileIcon from "../../../assets/icon/user-sidebar/profile-icon.svg";

function NavigationPanel() {
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path) => location.pathname.startsWith(path);
    const profile = useSelector((state) => state.profile?.profile_data || null);

    const ifActive = "bg-og-gradient text-white";
    const ifNonActive = "bg-white text-blackOpacity70";
    const h2CommonStyle = "text-sm font-medium";
    const buttonCommonStyle = "flex gap-2 items-center w-full justify-start py-2 px-5 relative h-[38px] rounded-md";

    const handleNavigate = (path) => {
        if (location.pathname !== `/${path}`) {
            navigate(`/${path}`);
        }
    };

    // Animation variants for the container
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08
            }
        }
    };

    // Animation variants for each button
    const buttonVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: { 
            opacity: 1, 
            x: 0,
            transition: { duration: 0.3 }
        }
    };

    return (
        <motion.div 
            className="navigation-panel flex flex-col gap-2"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            {/* Feed Button */}
            <motion.button
                className={`${buttonCommonStyle} ${isActive('/feed') ? ifActive : ifNonActive}`}
                onClick={() => handleNavigate("feed")}
                variants={buttonVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
            >
                <img
                    src={isActive('/feed') ? activeHomeIcon : nonActiveHomeIcon}
                    alt="feed"
                    className="w-[13px]"
                />
                <h2 className={h2CommonStyle}>Feed</h2>
            </motion.button>

            {/* Explore Button */}
            <motion.button
                className={`${buttonCommonStyle} ${isActive('/explore') ? ifActive : ifNonActive}`}
                onClick={() => handleNavigate("explore")}
                variants={buttonVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
            >
                <img
                    src={isActive('/explore') ? activeExploreIcon : nonActiveExploreIcon}
                    alt="explore"
                    className="w-[13px]"
                />
                <h2 className={h2CommonStyle}>Explore</h2>
            </motion.button>

            {/* Messages Button */}
            <motion.button
                className={`${buttonCommonStyle} ${isActive('/messages') ? ifActive : ifNonActive}`}
                onClick={() => handleNavigate("messages")}
                variants={buttonVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
            >
                <img
                    src={isActive('/messages') ? activeMessageIcon : nonActiveMessageIcon}
                    alt="messages"
                    className="w-[13px]"
                />
                <h2 className={h2CommonStyle}>Messages</h2>
            </motion.button>

            {/* My Profile Button */}
            <motion.button
                className={`${buttonCommonStyle} ${isActive(`/profile/${profile?.user?.username}`) ? ifActive : ifNonActive}`}
                onClick={() => profile?.user?.username && handleNavigate(`profile/${profile.user.username}`)}
                variants={buttonVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
            >
                <img
                    src={isActive(`/profile/${profile?.user?.username}`) ? activeProfileIcon : nonActiveProfileIcon}
                    alt="profile"
                    className="w-[13px]"
                />
                <h2 className={h2CommonStyle}>My Profile</h2>
            </motion.button>
        </motion.div>
    );
}

export default NavigationPanel;
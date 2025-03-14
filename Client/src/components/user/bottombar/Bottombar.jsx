import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, Search, User, CirclePlus, Send } from 'lucide-react';
import { useSelector } from "react-redux";
import PostTypeModal from "../../../components/user/post/PostTypeModal";

const Bottombar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isModalOpen, setModalOpen] = useState(false);
    const profile = useSelector((state) => state.profile.profile_data);

    const isActive = (path) => location.pathname.startsWith(path);
    const ifActive = "text-black";
    const ifNonActive = "text-gray-500";

    const handleNavigate = (path) => {
        if (location.pathname !== `/${path}`) {
            navigate(`/${path}`);
        }
    };

    // Animation variants
    const containerVariants = {
        hidden: { y: 100 },
        visible: { 
            y: 0,
            transition: { 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                when: "beforeChildren",
                staggerChildren: 0.05
            }
        }
    };

    const iconVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { 
                type: "spring",
                stiffness: 500,
                damping: 15
            }
        }
    };

    // Animation for the active indicator
    const activeIndicatorVariants = {
        hidden: { scaleX: 0 },
        visible: { 
            scaleX: 1,
            transition: { duration: 0.2 }
        }
    };

    return (
        <motion.div 
            className="lg:hidden fixed bottom-0 left-0 right-0 h-10 sm:h-11 md:h-16 px-2 bg-white border-t border-gray-200"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <div className="flex justify-between items-center h-full px-4">
                <motion.div 
                    className="relative flex flex-col items-center"
                    variants={iconVariants}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Home
                        className={`w-5 h-5 ${isActive('/feed') ? ifActive : ifNonActive}`}
                        onClick={() => handleNavigate('feed')}
                    />
                    {isActive('/feed') && (
                        <motion.div 
                            className="absolute -bottom-1 h-1 w-5 bg-black rounded-full"
                            variants={activeIndicatorVariants}
                        />
                    )}
                </motion.div>

                <motion.div 
                    className="relative flex flex-col items-center"
                    variants={iconVariants}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Search 
                        className={`w-5 h-5 ${isActive('/explore') ? ifActive : ifNonActive}`}
                        onClick={() => handleNavigate('explore')}
                    />
                    {isActive('/explore') && (
                        <motion.div 
                            className="absolute -bottom-1 h-1 w-5 bg-black rounded-full"
                            variants={activeIndicatorVariants}
                        />
                    )}
                </motion.div>

                <motion.div
                    variants={iconVariants}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    animate={isModalOpen ? { rotate: 45 } : { rotate: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <CirclePlus 
                        className={`w-5 h-5 ${isActive('/add-post') ? ifActive : ifNonActive}`}
                        onClick={() => setModalOpen(true)}
                    />
                </motion.div>

                <motion.div 
                    className="relative flex flex-col items-center"
                    variants={iconVariants}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Send
                        onClick={() => handleNavigate('messages')}
                        className={`w-5 h-5 ${isActive('/messages') ? ifActive : ifNonActive}`} 
                    />
                    {isActive('/messages') && (
                        <motion.div 
                            className="absolute -bottom-1 h-1 w-5 bg-black rounded-full"
                            variants={activeIndicatorVariants}
                        />
                    )}
                </motion.div>

                <motion.div 
                    className="relative flex flex-col items-center"
                    variants={iconVariants}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <User 
                        className={`w-5 h-5 ${isActive('/profile') ? ifActive : ifNonActive}`}
                        onClick={() => handleNavigate(`profile/${profile.user.username}`)}
                    />
                    {isActive('/profile') && (
                        <motion.div 
                            className="absolute -bottom-1 h-1 w-5 bg-black rounded-full"
                            variants={activeIndicatorVariants}
                        />
                    )}
                </motion.div>
            </div>
            <PostTypeModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                isBottom={true}
            />
        </motion.div>
    );
};

export default Bottombar;
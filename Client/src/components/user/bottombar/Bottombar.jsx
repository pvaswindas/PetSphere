import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, Search, User, CirclePlus, Send } from 'lucide-react';
import { useSelector } from "react-redux";
import PostTypeModal from "../../../components/user/post/PostTypeModal";



const Bottombar = () => {
    const location = useLocation()
    const navigate = useNavigate()

    const [isModalOpen, setModalOpen] = useState(false)

    const profile = useSelector((state) => state.profile.profile_data)

    const isActive = (path) => location.pathname.startsWith(path)

    const ifActive = "text-black"
    const ifNonActive = "text-gray-500"

    const handleNavigate = (path) => {
        if (location.pathname !== `/${path}`){
            navigate(`/${path}`)
        }
    }

    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 h-10 sm:h-11 md:h-16 px-2 bg-white border-t border-gray-200">
            <div className="flex justify-between items-center h-full px-4">
                <Home
                    className={`w-5 h-5 ${ isActive('/feed') ? ifActive : ifNonActive }`}
                    onClick={() => handleNavigate('feed')}
                />
                <Search 
                    className={`w-5 h-5 ${ isActive('/explore') ? ifActive : ifNonActive }`}
                    onClick={() => handleNavigate('explore')}
                />
                <CirclePlus 
                    className={`w-5 h-5 ${ isActive('/add-post') ? ifActive : ifNonActive }`}
                    onClick={() => setModalOpen(true)}
                />
                <Send
                    onClick={() => handleNavigate('messages')}
                    className={`w-5 h-5 ${ isActive('/messages') ? ifActive : ifNonActive }`} 
                />
                <User 
                    className={`w-5 h-5 ${ isActive('/profile') ? ifActive : ifNonActive }`}
                    onClick={() => handleNavigate(`profile/${profile.user.username}`)}
                />
            </div>
            <PostTypeModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                isBottom={true}
            />
        </div>
    );
};

export default Bottombar;

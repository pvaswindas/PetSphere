import React from 'react';
import { Video, MoreVertical } from 'lucide-react';
import userAvatar from "../../../../assets/icon/user-avatar.svg"
import { useNavigate } from 'react-router-dom';

const ChatHeader = ({ recipient = [] }) => {
    const navigate = useNavigate()
    return (
        <div className="p-6 bg-white backdrop-blur-md border-b-2 border-gray-50 rounded-tr-lg">
            <div className="flex justify-between h-[30px] items-center">
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <img
                            src={
                                recipient && recipient?.profile_picture ? recipient.profile_picture : userAvatar
                            }
                            alt=""
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-teal-400"
                        />
                    </div>
                    <div
                        className='cursor-pointer'
                        onClick={() => navigate(`/profile/${recipient.user.username}`)}
                    >
                        <h2 className="text-lg font-medium text-blackOpacity85">
                            {recipient && recipient?.user.name ? recipient.user.name : "Anonymous User"}
                        </h2>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <button className="p-2 rounded-lg hover:bg-teal-50 transition-colors">
                        <Video className="w-5 h-5 text-teal-600" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-teal-50 transition-colors">
                        <MoreVertical className="w-5 h-5 text-teal-600" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatHeader;

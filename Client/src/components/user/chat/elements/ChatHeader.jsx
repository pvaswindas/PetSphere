import React from 'react';
import { Video, MoreVertical } from 'lucide-react';
import userAvatar from "../../../../assets/icon/user-avatar.svg"

const ChatHeader = () => {
    
    return (
        <div className="p-6 bg-white backdrop-blur-md border-b-2 border-gray-50 rounded-tr-lg">
            <div className="flex justify-between h-[30px] items-center">
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <img
                            src=""
                            alt=""
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-teal-400"
                        />
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-medium text-blackOpacity85">Name</h2>
                        <p className="text-xs text-emerald-500 font-medium">Active Now</p>
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

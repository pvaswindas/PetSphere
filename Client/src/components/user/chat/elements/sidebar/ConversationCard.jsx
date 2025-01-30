import React from 'react';
import { formatTime } from '../../../../../utils/formatTime';
import userAvatar from "../../../../../assets/icon/user-avatar.svg"

const ConversationCard = ({ conversation }) => {
    return (
        <div
            className="p-4 lg:hover:bg-teal-50 cursor-pointer transition-colors"
            
        >
            <div className="flex items-center space-x-4">
                <div className="relative">
                    <img
                        src={
                            conversation && conversation?.other_user.profile_picture ? conversation?.other_user.profile_picture :
                            userAvatar
                        }
                        alt={conversation.other_user.user.username}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-teal-400"
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                        <h2 className="font-medium lg:font-semibold text-gray-900 truncate">{conversation.other_user.user.name}</h2>
                        <span className="text-sm text-gray-500">{formatTime(conversation.timestamp)}</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                        <p className="text-sm text-gray-600 truncate">{conversation.latest_message}</p>
                        {conversation.unread_count > 0 && (
                            <span className="ml-2 bg-teal-500 text-white text-xs rounded-full px-2 py-1 min-w-1 text-center">
                                {conversation.unread_count}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConversationCard;

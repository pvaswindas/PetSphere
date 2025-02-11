import React from 'react';
import { useSelector } from 'react-redux';
import { formatTime } from '../../../../utils/formatTime';

const MessageBubble = ({ message }) => {
    const profile = useSelector((state) => state.profile.profile_data);
    const username = profile?.user.username || null;
    
    const isCurrentUser = message.sender_username === username;

    return (
        <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`max-w-[70%] rounded-2xl p-4 break-words overflow-hidden ${
                    isCurrentUser
                        ? 'bg-gradient-to-r from-teal-500 to-purple-400 text-white'
                        : 'bg-white text-gray-800'
                }`}
                style={{
                    wordWrap: 'break-word',
                    whiteSpace: 'pre-line',
                    overflow: 'hidden',
                }}
            >
                <p className="text-sm leading-relaxed">
                    {message?.content && message.content.length > 50
                        ? message.content.replace(/(.{50})\s/g, '$1\n')
                        : message?.content}
                </p>
                <p className={`text-[0.7rem] mt-2 ${
                    isCurrentUser ? 'text-white' : 'text-gray-500'
                }`}>
                    {formatTime(message.timestamp)}
                </p>
            </div>
        </div>
    );
};

export default MessageBubble;
import React from 'react';
import { useSelector } from 'react-redux';
import { formatTime } from '../../../../utils/formatTime';

const MessageBubble = ({ message }) => {
    const profile = useSelector((state) => state.profile.profile_data);
    const username = profile?.user.username || null;

    return (
        <div className={`flex ${message.sender_username === username ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`max-w-[70%] rounded-2xl p-4 break-words ${
                    message.sender_username === username
                        ? 'bg-gradient-to-r from-teal-500 to-purple-400 text-white'
                        : 'bg-white text-gray-800'
                } shadow-sm`}
                style={{ wordWrap: 'break-word', whiteSpace: 'pre-line' }}
            >
                <p className="text-[15px] leading-relaxed">
                    {message.content.length > 50
                        ? message.content.replace(/(.{50})\s/g, '$1\n') // Adds a line break at every 50 characters, keeping words intact
                        : message.content}
                </p>
                <p className={`text-xs mt-2 ${
                    message.sender_username === username ? 'text-white' : 'text-gray-500'
                }`}>
                    {formatTime(message.timestamp)}
                </p>
            </div>
        </div>
    );
};

export default MessageBubble;

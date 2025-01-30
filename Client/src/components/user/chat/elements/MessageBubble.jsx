import React from 'react';

const MessageBubble = ({ message }) => {
    return (
        <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`max-w-[70%] rounded-2xl p-4 ${
                    message.sender === 'user'
                        ? 'bg-gradient-to-r from-teal-500 to-purple-400 text-white'
                        : 'bg-white text-gray-800'
                } shadow-sm`}
            >
                <p className="text-[15px] leading-relaxed">{message.text}</p>
                <p className={`text-xs mt-2 ${
                    message.sender === 'user' ? 'text-teal-200' : 'text-gray-500'
                }`}>
                    {message.timestamp}
                </p>
            </div>
        </div>
    );
};

export default MessageBubble;

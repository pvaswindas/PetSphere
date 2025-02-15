import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { X, Play } from 'lucide-react';
import { formatTime } from '../../../../utils/formatTime';

const MessageBubble = ({ message }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const profile = useSelector((state) => state.profile.profile_data);
    const username = profile?.user.username || null;
    const isCurrentUser = message.sender_username === username;

    // Check if media is a video
    const isVideo = message.media_url?.match(/\.(mp4|webm|ogg)$/i);

    return (
        <>
            {/* Message Bubble */}
            <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                <div
                    className={`max-w-[70%] rounded-2xl ${!message.media_url ? 'p-4' : 'p-2'}  break-words overflow-hidden ${
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
                    {/* Clickable Media for Full View */}
                    {message.media_url && (
                        <>
                            {isVideo ? (
                                <div className="relative mb-2 rounded-lg max-w-full cursor-pointer hover:opacity-80" onClick={() => setIsModalOpen(true)}>
                                    <video 
                                        src={message.media_url} 
                                        className="rounded-lg max-w-full" 
                                        muted
                                    />
                                    {/* Play Icon in Center */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Play className="text-white w-10 h-10 bg-black bg-opacity-50 rounded-lg p-2" />
                                    </div>
                                </div>
                            ) : (
                                <img
                                    src={message.media_url}
                                    alt={message.message_type}
                                    className="mb-2 rounded-lg max-w-full cursor-pointer hover:opacity-80"
                                    onClick={() => setIsModalOpen(true)}
                                />
                            )}
                        </>
                    )}

                    {/* Message Content */}
                    {message.content && (
                        <p className="text-sm leading-relaxed">
                            {message.content.length > 50 ? message.content.replace(/(.{50})\s/g, '$1\n') : message.content}
                        </p>
                    )}

                    {/* Timestamp */}
                    <p className={`text-[0.7rem] mt-2 ${isCurrentUser ? 'text-white' : 'text-gray-500'}`}>
                        {formatTime(message.timestamp)}
                    </p>
                </div>
            </div>

            {/* Fullscreen Modal for Media Preview */}
            {isModalOpen && (
                <div 
                    className="fixed bottom-0 left-0 right-0 flex items-center justify-center min-h-screen lg:min-h-full bg-black bg-opacity-70 z-50 lg:rounded-e-lg"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div className="relative w-full h-full flex items-center justify-center">
                        {/* Close Button */}
                        <button
                            className="absolute top-4 right-4 text-white text-3xl font-bold cursor-pointer"
                            onClick={() => setIsModalOpen(false)}
                        >
                            <X />
                        </button>

                        {/* Fullscreen Media */}
                        {isVideo ? (
                            <video 
                                src={message.media_url} 
                                className="max-w-screen max-h-screen mx-auto"
                                controls
                                autoPlay
                            />
                        ) : (
                            <img 
                                src={message.media_url} 
                                alt={message.message_type} 
                                className="max-w-screen max-h-screen mx-auto"
                            />
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default MessageBubble;

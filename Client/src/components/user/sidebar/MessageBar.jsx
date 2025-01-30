import { SearchIcon } from 'lucide-react';
import React, { useState } from 'react';

function MessageBar() {
    const [searchTerm, setSearchTerm] = useState('');
    const messages = [
        {
            id: 1,
            profilePic: 'https://via.placeholder.com/40',
            sender: 'John Doe',
            lastMessage: 'Hey, how are you?',
            unreadCount: 100,
            lastMessageTime: '2 min ago',
        },
        {
            id: 2,
            profilePic: 'https://via.placeholder.com/40',
            sender: 'Jane Smith',
            lastMessage: 'Meeting at 3 PM',
            unreadCount: 1,
            lastMessageTime: '5 min ago',
        },
    ];

    const filteredMessages = messages.filter(message => 
        message.sender.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-full h-[610px] bg-white shadow-md rounded-lg py-4 px-6 flex flex-col">
            <h3 className='text-blackOpacity85 font-medium'>Messages</h3>
            {/* Search bar */}
            <div className={`flex items-center py-1 px-2 bg-[#B9B9B9]/15 rounded-md my-3`}>
                <SearchIcon size={20} color="rgba(185, 185, 185, 0.9)" />
                <input
                    id="message-search"
                    name="message-search"
                    type="text"
                    autoComplete="off"
                    placeholder="Search for message"
                    className="flex-1 bg-transparent focus:outline-none px-1 text-gray-500 placeholder-lightTextGrey"
                />
            </div>

            <hr />

            {/* Message list */}
            <div className="max-h-80 overflow-y-auto flex-grow">
                {filteredMessages.map(message => (
                    <div key={message.id} className="flex items-center py-3">
                        {/* Profile picture */}
                        <img 
                            src={message.profilePic} 
                            alt={message.sender} 
                            className="w-10 h-10 rounded-full mr-3"
                        />
                        <div className="flex-grow">
                            {/* Sender and last message */}
                            <span className="font-semibold text-blackOpacity85">{message.sender}</span>
                            <div className="text-sm text-gray-600">
                                {message.lastMessage}
                            </div>
                        </div>
                        <div className='flex flex-col items-end'>
                            {/* New message indicator */}
                            {message.unreadCount > 0 && (
                                <span className="flex items-center justify-center text-xs text-white bg-teal-500 p-1 w-5 h-5 text-center rounded-full">
                                    {message.unreadCount > 99 ? '+99' : message.unreadCount}
                                </span>
                            )}
                            {/* Last message received time */}
                            <span className="text-xs text-gray-500">{message.lastMessageTime}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* View All link at the bottom */}
            <div className="mt-auto text-left text-sm">
                <a href="/feed" className="text-teal-700 hover:text-teal-500">View All</a>
            </div>
        </div>
    );
}

export default MessageBar;

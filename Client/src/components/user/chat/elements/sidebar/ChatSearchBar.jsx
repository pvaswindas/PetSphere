import React from 'react';
import { Search } from 'lucide-react';

const ChatSearchBar = () => {
    return (
        <div className="relative items-center flex justify-center">
            <input
                type="text"
                placeholder="Search chats or contacts"
                className="w-full px-4 py-2 bg-gray-100 rounded-full lg:rounded-xl pl-10 focus:outline-none lg:ring-2 lg:ring-teal-400 lg:transition-all lg:hover:ring-teal-500"
            />
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
    );
};

export default ChatSearchBar;

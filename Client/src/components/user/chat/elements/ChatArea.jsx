import React from 'react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const ChatArea = () => {
    
    return (
        <div className="flex-1 flex flex-col lg:rounded-e-lg h-full bg-white backdrop-blur-md lg:shadow-md">
            <ChatHeader />
            <MessageList />
            <MessageInput />
        </div>
    );
};

export default ChatArea;

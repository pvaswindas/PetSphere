import React from 'react';
import ConversationCard from './ConversationCard';

const ConversationList = ({ conversations = [] }) => {
    return (
        <div className="overflow-y-auto h-[calc(88vh-9rem)]">
            {conversations && conversations.length > 0 ? (
                conversations.map((conversation) => (
                    <ConversationCard key={conversation.conversation_id} conversation={conversation} />
                ))
            ) : (
                <p className="text-gray-500 p-4 text-center">No conversations available</p>
            )}
        </div>
    );
};


export default ConversationList;

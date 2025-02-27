import React from 'react';
import ConversationCard from './ConversationCard';

const ConversationList = ({ conversations = [], searchTerm }) => {
    const filteredConversations = conversations.filter((conversation) =>
        conversation.other_user?.user.username
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    return (
        <div className="overflow-y-auto h-[calc(88vh-9rem)]">
            {filteredConversations.length > 0 ? (
                filteredConversations.map((conversation) => (
                    <ConversationCard key={conversation.conversation_id} conversation={conversation} />
                ))
            ) : (
                <p className="text-gray-500 p-4 text-center">No conversations found</p>
            )}
        </div>
    );
};

export default ConversationList;

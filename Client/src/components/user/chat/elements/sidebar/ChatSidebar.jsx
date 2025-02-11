import ChatSearchBar from './ChatSearchBar';
import ConversationList from './ConversationList';

const ChatSidebar = ({ conversations = [] }) => {
    return (
        <div className="w-full bg-white/90 backdrop-blur-md border-e-2 border-gray-50 rounded-l-lg h-full">
            <div className="p-3 lg:p-6 flex flex-col lg:border-b border-gray-200 gap-2 lg:gap-4">
                <h1 className="text-xl lg:text-2xl font-medium lg:font-bold text-black/80">
                    Messages
                </h1>
                <ChatSearchBar />
            </div>
            <ConversationList conversations={conversations} />
        </div>
    );
};

export default ChatSidebar;

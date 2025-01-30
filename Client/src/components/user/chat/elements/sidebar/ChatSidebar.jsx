import React, { useEffect, useState } from 'react';
import ChatSearchBar from './ChatSearchBar';
import ConversationList from './ConversationList';
import { getConversation } from '../../../../../utils/getConversations';
import AlertSnackbar from '../../../../Snackbar/AlertSnackbar';

const ChatSidebar = () => {
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const [conversations, setConversations] = useState([])

    useEffect(() => {
        const fetchConversation = async () => {
            try {
                const data = await getConversation();
                setConversations(data);
            } catch (error) {
                setSnackbarMessage("Unable to get conversations");
                setSnackbarOpen(true);
            }
        };
    
        fetchConversation();
    }, []);

    return (
        <div className="w-full bg-white/90 backdrop-blur-md border-e-2 border-gray-50 rounded-l-lg h-full lg:shadow-lg">
            <AlertSnackbar
                open={snackbarOpen}
                message={snackbarMessage}
                alert_type="error"
                onClose={() => setSnackbarOpen(false)}
            />
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

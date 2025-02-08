import ChatSidebar from '../elements/sidebar/ChatSidebar'
import { useEffect, useState } from 'react';
import { getConversation } from '../../../../utils/ChatsUtils';
import AlertSnackbar from '../../../Snackbar/AlertSnackbar';
import BlankChatArea from '../elements/BlankChatArea';

function InactiveChatScreen() {

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
        <div className="flex w-full bg-gradient-to-tr from-teal-50 to-amber-100 lg:rounded-lg h-full lg:h-[615px] lg:shadow-md">
            <AlertSnackbar
                open={snackbarOpen}
                message={snackbarMessage}
                alert_type="error"
                onClose={() => setSnackbarOpen(false)}
            />
            <div className="lg:w-1/3 flex-grow">
                <ChatSidebar conversations={conversations} />
            </div>
            <div className="hidden lg:flex lg:w-full">
                <BlankChatArea />
            </div>
        </div>
    )
}

export default InactiveChatScreen

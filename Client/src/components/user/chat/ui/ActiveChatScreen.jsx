import ChatSidebar from '../elements/sidebar/ChatSidebar'
import ChatArea from '../elements/ChatArea'
import { useEffect, useState } from 'react';
import { getConversation } from '../../../../utils/ChatsUtils';
import AlertSnackbar from '../../../Snackbar/AlertSnackbar';
import { useParams } from 'react-router-dom';

function ActiveChatScreen() {
    const { username } = useParams();

    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const [activeConversation, setActiveConversation] = useState(null)

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


    useEffect(() => {
        if (conversations.length > 0) {
            const receiver = conversations.find(
                (conv) => conv.other_user?.user.username === username
            )
            setActiveConversation(receiver)
        }
    }, [username, conversations])

    return (
        <div className="flex w-full bg-gradient-to-tr from-teal-50 to-amber-100 h-full lg:h-[615px] lg:rounded-lg lg:shadow-md">
            <AlertSnackbar
                open={snackbarOpen}
                message={snackbarMessage}
                alert_type="error"
                onClose={() => setSnackbarOpen(false)}
            />
            <div className="hidden lg:flex lg:w-1/3">
                <ChatSidebar conversations={conversations}/>
            </div>
            <div className="lg:w-full flex-grow">
                <ChatArea activeConversation={activeConversation} />
            </div>
        </div>
    )
}

export default ActiveChatScreen
import React, { useEffect, useState } from 'react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { useParams } from 'react-router-dom';
import { getMessages } from '../../../../utils/ChatsUtils';
import AlertSnackbar from '../../../Snackbar/AlertSnackbar';
import { chatWebSocket } from '../../../../utils/wsUtil';

const ChatArea = ({ activeConversation = [] }) => {
    const { username } = useParams();
    const [messages, setMessages] = useState([]);
    const [recipient, setRecipient] = useState(null);
    const [socket, setSocket] = useState(null);

    const [message, setMessage] = useState("");
    const [selectedFiles, setSelectedFiles] = useState([]);

    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('ACCESS_TOKEN');
        if (!username || !token) return;

        const ws = chatWebSocket(
            username,
            token,
            (data) => {
                const newMessage = data.message;
                setMessages((prevMessages) => {
                    const messageExists = prevMessages.some(msg => msg.id === newMessage.id);
                    return messageExists ? prevMessages : [...prevMessages, newMessage];
                });
            },
            (ws) => setSocket(ws),
        );

        return () => {
            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        };
    }, [username]);

    useEffect(() => {
        setMessages([]);
        const fetchMessages = async () => {
            try {
                const data = await getMessages(username);
                setMessages(prevMessages => (prevMessages.length === 0 ? data.messages : prevMessages));

                if (activeConversation) {
                    setRecipient(activeConversation.other_user);
                }
            } catch (error) {
                setSnackbarMessage("Unable to fetch messages!");
                setSnackbarOpen(true);
            }
        };

        fetchMessages();
    }, [username, activeConversation]);



    const handleSend = async ({ text, file }) => {
        if ((!text.trim() && !file) || !socket || socket.readyState !== WebSocket.OPEN) return;

        const messageData = { message: text.trim() };
        if (file) {
            messageData.file = file;
        }
        socket.send(JSON.stringify(messageData));
        setMessage("");
        setSelectedFiles([]);
    };

    return (
        <div className="flex-1 flex flex-col lg:rounded-e-lg h-full bg-white backdrop-blur-md">
            <AlertSnackbar
                open={snackbarOpen}
                message={snackbarMessage}
                alert_type="error"
                onClose={() => setSnackbarOpen(false)}
            />
            <ChatHeader recipient={recipient} />
            <MessageList messages={messages} />
            <MessageInput 
                message={message} 
                setMessage={setMessage} 
                selectedFiles={selectedFiles}
                setSelectedFiles={setSelectedFiles}
                onSend={handleSend}
                setSnackbarMessage={setSnackbarMessage}
                setSnackbarOpen={setSnackbarOpen}
            />
        </div>
    );
};

export default ChatArea;

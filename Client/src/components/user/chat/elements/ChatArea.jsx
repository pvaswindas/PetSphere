import React, { useEffect, useState } from 'react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { useParams } from 'react-router-dom';
import { getMessages } from '../../../../utils/ChatsUtils';
import AlertSnackbar from '../../../Snackbar/AlertSnackbar';
import { chatWebSocket } from '../../../../utils/wsUtil';

const ChatArea = ({ conversations = [] }) => {
    const { username } = useParams();
    const [messages, setMessages] = useState([]);
    const [recipient, setRecipient] = useState(null);
    const [socket, setSocket] = useState(null);
    const [message, setMessage] = useState("");

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
            (ws) => setSocket(ws), // onOpen
            () => console.log("WebSocket Disconnected"), // onClose
            (err) => console.error("WebSocket Error:", err) // onError
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
                setMessages(prevMessages => (prevMessages.length === 0 ? data : prevMessages));

                if (data.length > 0) {
                    const conversationId = data[0].conversation_id;
                    const conversation = conversations.find(conv => conv.conversation_id === conversationId);
                    if (conversation) setRecipient(conversation.other_user);
                }
            } catch (error) {
                setSnackbarMessage("Unable to fetch messages!");
                setSnackbarOpen(true);
            }
        };

        fetchMessages();
    }, [username, conversations]);

    const handleSend = (e) => {
        e.preventDefault();
        if (message.trim() && socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ message: message.trim() }));
            setMessage("");
        }
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
            <MessageInput message={message} setMessage={setMessage} onSend={handleSend} />
        </div>
    );
};

export default ChatArea;

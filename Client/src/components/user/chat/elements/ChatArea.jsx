import React, { useEffect, useState, useRef } from 'react';
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
    const [socketInstance, setSocketInstance] = useState(null);
    const webSocketRef = useRef(null);

    const [message, setMessage] = useState("");
    const [selectedFiles, setSelectedFiles] = useState([]);

    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [connecting, setConnecting] = useState(false);

    useEffect(() => {
        // Cleanup function for WebSocket
        return () => {
            if (webSocketRef.current) {
                console.log("Cleaning up WebSocket connection");
                webSocketRef.current.close();
                webSocketRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('ACCESS_TOKEN');
        if (!username || !token || connecting) return;

        // Close previous connection if it exists
        if (webSocketRef.current) {
            webSocketRef.current.close();
            webSocketRef.current = null;
        }

        setConnecting(true);

        const wsConnection = chatWebSocket(
            username,
            token,
            (data) => {
                const newMessage = data.message;
                setMessages((prevMessages) => {
                    const messageExists = prevMessages.some(msg => msg.id === newMessage.id);
                    return messageExists ? prevMessages : [...prevMessages, newMessage];
                });
            },
            (ws) => {
                setSocketInstance(ws);
                setConnecting(false);
            },
            () => {
                setSocketInstance(null);
                setConnecting(false);
            },
            (error) => {
                setSnackbarMessage("Connection error! Please try again later.");
                setSnackbarOpen(true);
                setConnecting(false);
            }
        );

        // Store the reference to allow cleanup
        webSocketRef.current = wsConnection;

        return () => {
            if (wsConnection) {
                wsConnection.close();
            }
        };
    }, [username, connecting]);

    useEffect(() => {
        setMessages([]);
        const fetchMessages = async () => {
            try {
                const data = await getMessages(username);
                setMessages(data.messages || []);

                if (activeConversation) {
                    setRecipient(activeConversation.other_user);
                }
            } catch (error) {
                console.error("Failed to fetch messages:", error);
                setSnackbarMessage("Unable to fetch messages!");
                setSnackbarOpen(true);
            }
        };

        if (username) {
            fetchMessages();
        }
    }, [username, activeConversation]);

    const handleSend = async ({ text, file }) => {
        if ((!text.trim() && !file) || !socketInstance) {
            setSnackbarMessage("Cannot send message")
            setSnackbarOpen(true)
            return;
        }

        try {
            const messageData = { message: text.trim() };
            if (file) {
                messageData.file = file;
            }
            
            socketInstance.send(JSON.stringify(messageData));
            setMessage("");
            setSelectedFiles([]);
        } catch (error) {
            setSnackbarMessage("Failed to send message");
            setSnackbarOpen(true);
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
            <MessageInput 
                message={message} 
                setMessage={setMessage} 
                selectedFiles={selectedFiles}
                setSelectedFiles={setSelectedFiles}
                onSend={handleSend}
                setSnackbarMessage={setSnackbarMessage}
                setSnackbarOpen={setSnackbarOpen}
                disabled={!socketInstance}
            />
        </div>
    );
};

export default ChatArea;
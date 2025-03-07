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

    // ChatArea.jsx - improved WebSocket connection logic
    useEffect(() => {
        const token = localStorage.getItem('ACCESS_TOKEN');
        if (!username || !token) return;
        
        // Connection state tracking
        let isConnecting = false;
        let reconnectAttempts = 0;
        const maxReconnectAttempts = 5;
        const reconnectDelay = attempt => Math.min(1000 * Math.pow(2, attempt), 30000);
        
        const connectWebSocket = () => {
            if (isConnecting) return;
            
            isConnecting = true;
            setConnecting(true);
            
            // Close any existing connection
            if (webSocketRef.current) {
                webSocketRef.current.close();
                webSocketRef.current = null;
            }
            
            console.log(`Attempting connection (attempt ${reconnectAttempts + 1})`);
            
            const wsConnection = chatWebSocket(
                username,
                token,
                (data) => {
                    // Message handler
                    const newMessage = data.message;
                    setMessages((prevMessages) => {
                        // Proper deduplication by ID
                        if (prevMessages.some(msg => msg.id === newMessage.id)) {
                            return prevMessages;
                        }
                        return [...prevMessages, newMessage];
                    });
                    
                    // Reset reconnect attempts on successful data
                    reconnectAttempts = 0;
                },
                (ws) => {
                    // Connection success
                    console.log("WebSocket connected successfully");
                    setSocketInstance(ws);
                    setConnecting(false);
                    isConnecting = false;
                    reconnectAttempts = 0;
                },
                () => {
                    // Connection closed handler
                    console.log("WebSocket connection closed");
                    setSocketInstance(null);
                    setConnecting(false);
                    isConnecting = false;
                    
                    // Only attempt reconnect if component is still mounted
                    if (reconnectAttempts < maxReconnectAttempts) {
                        reconnectAttempts++;
                        setTimeout(connectWebSocket, reconnectDelay(reconnectAttempts));
                    } else {
                        setSnackbarMessage("Connection failed after multiple attempts. Please reload the page.");
                        setSnackbarOpen(true);
                    }
                },
                (error) => {
                    // Error handler
                    console.error("WebSocket connection error:", error);
                    setSnackbarMessage("Connection error! Please try again later.");
                    setSnackbarOpen(true);
                    setConnecting(false);
                    isConnecting = false;
                    
                    // Only attempt reconnect if component is still mounted
                    if (reconnectAttempts < maxReconnectAttempts) {
                        reconnectAttempts++;
                        setTimeout(connectWebSocket, reconnectDelay(reconnectAttempts));
                    }
                }
            );
            
            // Store the reference to allow cleanup
            webSocketRef.current = wsConnection;
        };
        
        connectWebSocket();
        
        // Clean up on unmount
        return () => {
            console.log("Component unmounting, cleaning up WebSocket");
            if (webSocketRef.current) {
                webSocketRef.current.close();
                webSocketRef.current = null;
            }
        };
    }, [username]);

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
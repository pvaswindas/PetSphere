import React, { useEffect, useState, useRef } from 'react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { useParams } from 'react-router-dom';
import { getMessages } from '../../../../utils/ChatsUtils';
import AlertSnackbar from '../../../Snackbar/AlertSnackbar';
import { chatWebSocket } from '../../../../utils/wsUtil';

const ChatArea = ({ activeConversation = null, setIsNewMessage }) => {
    const { username } = useParams();
    const [messages, setMessages] = useState([]);
    const [recipient, setRecipient] = useState(null);
    const [socketInstance, setSocketInstance] = useState(null);
    const webSocketRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);

    const [message, setMessage] = useState("");
    const [selectedFiles, setSelectedFiles] = useState([]);

    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    
    // Track seen message IDs to avoid duplicates
    const seenMessageIds = useRef(new Set());

    useEffect(() => {
        // Cleanup function for WebSocket and any pending timeouts
        return () => {
            if (webSocketRef.current) {
                webSocketRef.current.close();
                webSocketRef.current = null;
            }
            
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
                reconnectTimeoutRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('ACCESS_TOKEN');
        if (!username || !token) return;
        
        // Reset seen message IDs when changing conversations
        seenMessageIds.current = new Set();
        
        // Connection state tracking
        let isConnecting = false;
        let reconnectAttempts = 0;
        const maxReconnectAttempts = 10;
        const reconnectDelay = attempt => Math.min(1000 * Math.pow(2, attempt), 30000);
        
        const connectWebSocket = () => {
            if (isConnecting) return;
            
            isConnecting = true;
            
            // Close any existing connection
            if (webSocketRef.current) {
                webSocketRef.current.close();
                webSocketRef.current = null;
            }
            
            const wsConnection = chatWebSocket(
                username,
                token,
                (data) => {
                    const newMessage = data.message;
                    
                    // Ensure the message has an id property
                    if (!newMessage.id) {
                        newMessage.id = Date.now().toString();
                    }
                    

                    if (!seenMessageIds.current.has(newMessage.id)) {
                        seenMessageIds.current.add(newMessage.id);
                        
                        setMessages((prevMessages) => {
                            if (prevMessages.some(msg => msg.id === newMessage.id)) {
                                return prevMessages;
                            }
                            return [...prevMessages, newMessage];
                        });
                    }
                    
                    reconnectAttempts = 0;
                },
                (ws) => {
                    // Connection success
                    setSocketInstance(ws);
                    isConnecting = false;
                    reconnectAttempts = 0;
                },
                () => {
                    // Connection closed handler
                    setSocketInstance(null);
                    isConnecting = false;
                    
                    // Only attempt reconnect if component is still mounted
                    if (reconnectAttempts < maxReconnectAttempts) {
                        reconnectAttempts++;
                        reconnectTimeoutRef.current = setTimeout(connectWebSocket, reconnectDelay(reconnectAttempts));
                    } else {
                        setSnackbarMessage("Failed to connect. Please reload the page and try again.");
                        setSnackbarOpen(true);
                    }
                },
                (error) => {
                    // Error handler
                    setSnackbarMessage("Connection error! Please try again later.");
                    setSnackbarOpen(true);
                    isConnecting = false;
                    
                    // Only attempt reconnect if component is still mounted
                    if (reconnectAttempts < maxReconnectAttempts) {
                        reconnectAttempts++;
                        reconnectTimeoutRef.current = setTimeout(connectWebSocket, reconnectDelay(reconnectAttempts));
                    }
                }
            );
            
            webSocketRef.current = wsConnection;
        };
        
        connectWebSocket();
        
        // Clean up on unmount
        return () => {
            if (webSocketRef.current) {
                webSocketRef.current.close();
                webSocketRef.current = null;
            }
            
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
                reconnectTimeoutRef.current = null;
            }
        };
    }, [username]);

    useEffect(() => {
        setMessages([]);
        seenMessageIds.current = new Set();
        
        const fetchMessages = async () => {
            try {
                const data = await getMessages(username);
                const initialMessages = data.messages || [];
                
                // Add initial message IDs to seen set
                initialMessages.forEach(msg => {
                    if (msg.id) {
                        seenMessageIds.current.add(msg.id);
                    }
                });
                
                setMessages(initialMessages);

                if (activeConversation) {
                    setRecipient(activeConversation.other_user);
                }
            } catch (error) {
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
            setSnackbarMessage("Cannot send message");
            setSnackbarOpen(true);
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
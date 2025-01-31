import React, { useEffect, useState } from 'react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { useParams } from 'react-router-dom';
import { getMessages } from '../../../../utils/ChatsUtils';

const ChatArea = ({ conversations = [] }) => {
    const { username } = useParams();
    const [messages, setMessages] = useState([]);
    const [recipient, setRecipient] = useState(null);
    const [socket, setSocket] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        // WebSocket setup
        const ws = new WebSocket("ws://localhost:8000/ws/chat/abhi/");
        ws.onopen = () => console.log("WebSocket connection established!");
        ws.onerror = (err) => console.log("WebSocket error:", err);

        setSocket(ws);

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessages((prevMessages) => [...prevMessages, data]);
        };

        ws.onclose = () => console.log("WebSocket Disconnected");

        return () => {
            ws.close();
        };
    }, [username]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const data = await getMessages(username);
                setMessages(data);

                if (data.length > 0) {
                    const conversationId = data[0].conversation_id;
                    const conversation = conversations.find(conv => conv.conversation_id === conversationId);
                    if (conversation) {
                        setRecipient(conversation.other_user);
                    }
                }
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        fetchMessages();
    }, [username, conversations]);

    const handleSend = (e) => {
        e.preventDefault();
        if (message.trim() && socket) {
            socket.send(JSON.stringify({ message }));
            setMessage(""); // Clear input after sending
        }
    };

    return (
        <div className="flex-1 flex flex-col lg:rounded-e-lg h-full bg-white backdrop-blur-md lg:shadow-md">
            <ChatHeader recipient={recipient} />
            <MessageList messages={messages} />
            <MessageInput message={message} setMessage={setMessage} onSend={handleSend} />
        </div>
    );
};

export default ChatArea;

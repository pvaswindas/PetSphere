import React, { useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble";
import { ChevronDown } from "lucide-react";

const MessageList = ({ messages = [] }) => {
    const messageListRef = useRef(null);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const scrollToBottom = () => {
        if (messageListRef.current) {
            messageListRef.current.scrollTo({ top: messageListRef.current.scrollHeight, behavior: "smooth" });
    
            setTimeout(() => {
                if (messageListRef.current) {
                    const { scrollTop, scrollHeight, clientHeight } = messageListRef.current;
                    setShowScrollButton(scrollTop + clientHeight < scrollHeight - 20);
                }
            }, 200);
        }
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            scrollToBottom();
        }, 100);
    
        return () => clearTimeout(timeout);
    }, [messages]);

    useEffect(() => {
        const checkScroll = () => {
            if (messageListRef.current) {
                const { scrollTop, scrollHeight, clientHeight } = messageListRef.current;
                setShowScrollButton(scrollTop + clientHeight < scrollHeight - 20);
            }
        };
    
        checkScroll();
    
        const handleScroll = () => checkScroll();
    
        const currentRef = messageListRef.current;
        if (currentRef) {
            currentRef.addEventListener("scroll", handleScroll);
        }
    
        return () => {
            if (currentRef) {
                currentRef.removeEventListener("scroll", handleScroll);
            }
        };
    }, [messages]);

    return (
        <div
            className="relative flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-tl from-teal-50 to-amber-100"
            ref={messageListRef}
            style={{ maxHeight: "calc(100vh - 160px)" }}
        >
            {Array.isArray(messages) && messages.length > 0 ? (
                messages.map((message, index) => {
                    // Ensure message is not null or undefined before rendering
                    if (!message) return null;
                    
                    return (
                        <MessageBubble 
                            key={message.id || `message-${index}`} 
                            message={message} 
                        />
                    );
                })
            ) : (
                <div className="flex justify-center items-center h-full text-gray-500">
                    No messages yet. Start the conversation!
                </div>
            )}
    
            {showScrollButton && (
                <div className="sticky bottom-2 flex justify-center">
                    <button
                        onClick={scrollToBottom}
                        className="bg-teal-200 p-2 rounded-full transition hover:bg-teal-300 hover:shadow-md"
                    >
                        <ChevronDown size={20} color="black" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default MessageList;
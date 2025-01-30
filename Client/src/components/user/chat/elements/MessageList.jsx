import React, { useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble";
import { ChevronDown } from "lucide-react";

const MessageList = () => {
    // const messageListRef = useRef(null);
    // const [showScrollButton, setShowScrollButton] = useState(false);

    // const scrollToBottom = () => {
    //     if (messageListRef.current) {
    //         messageListRef.current.scrollTo({ top: messageListRef.current.scrollHeight, behavior: "smooth" });
    //     }
    // };

    // useEffect(() => {
    //     scrollToBottom();
    // }, []);

    // useEffect(() => {
    //     const handleScroll = () => {
    //         if (messageListRef.current) {
    //             const { scrollTop, scrollHeight, clientHeight } = messageListRef.current;
    //             setShowScrollButton(scrollTop + clientHeight < scrollHeight - 20);
    //         }
    //     };

    //     const currentRef = messageListRef.current;
    //     if (currentRef) {
    //         currentRef.addEventListener("scroll", handleScroll);
    //     }

    //     return () => {
    //         if (currentRef) {
    //             currentRef.removeEventListener("scroll", handleScroll);
    //         }
    //     };
    // }, []);

    return (
        <div className="relative flex-1 overflow-y-auto p-6 space-y-6 h-full lg:max-h-[500px] bg-gradient-to-tl from-teal-50 to-amber-100" >
            {/* {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
            ))}

            {showScrollButton && (
                <div className="sticky bottom-2 flex justify-center">
                    <button
                        onClick={scrollToBottom}
                        className="bg-teal-200 p-2 rounded-full transition hover:bg-teal-300 hover:shadow-md"
                    >
                        <ChevronDown size={20} color="black" />
                    </button>
                </div>
            )} */}
        </div>
    );
};

export default MessageList;

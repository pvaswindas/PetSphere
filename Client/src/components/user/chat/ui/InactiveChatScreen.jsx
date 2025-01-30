import React, { useState } from 'react'
import ChatSidebar from '../elements/sidebar/ChatSidebar'
import BlankChatArea from '../elements/BlankChatArea';

function InactiveChatScreen() {
    const [activeChat, setActiveChat] = useState(null)

    return (
        <div className="flex w-full bg-gradient-to-tr from-teal-50 to-amber-100 lg:rounded-lg h-full lg:h-[615px]"> {/* Adjusted layout */}

            <div className="lg:w-1/3 flex-grow">
                <ChatSidebar activeChat={activeChat} setActiveChat={setActiveChat} />
            </div>
            <div className="hidden lg:flex lg:w-full">
                <BlankChatArea />
            </div>
        </div>
    )
}

export default InactiveChatScreen

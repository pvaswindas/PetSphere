import React from 'react'
import Navbar from '../../../components/user/Navbar/Navbar'
import AdPreviewBar from '../../../components/user/sidebar/AdPreviewBox'
import Sidebar from '../../../components/user/sidebar/Sidebar'
import ActiveChatScreen from '../../../components/user/chat/ui/ActiveChatScreen'

function Chat() {
    return (
        <div className="bg-white lg:bg-whiteOpacity02 min-h-screen flex flex-col">
            {/* Navbar (Only visible on lg and above) */}
            <div className="hidden lg:block">
                <Navbar />
            </div>

            {/* Main Layout */}
            <div className="flex flex-grow lg:flex-row lg:px-2 lg:py-6">
                {/* Sidebar Section */}
                <div className="hidden lg:flex flex-col lg:px-4 lg:w-1/5">
                    <div className="space-y-4 h-[calc(100vh-56px)] overflow-y-auto rounded-lg pb-12">
                        {/* AdPreviewBar */}
                        <AdPreviewBar />

                        {/* Sidebar */}
                        <Sidebar />
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 w-full lg:w-3/5 lg:mx-3 lg:rounded-lg">
                    {/* Profile Card */}
                    <ActiveChatScreen />
                </div>
            </div>
        </div>
    )
}

export default Chat

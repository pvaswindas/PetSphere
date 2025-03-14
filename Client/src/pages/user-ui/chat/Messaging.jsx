import React from 'react'
import Navbar from '../../../components/user/Navbar/Navbar'
// import AdPreviewBar from '../../../components/user/sidebar/AdPreviewBox'
import Sidebar from '../../../components/user/sidebar/Sidebar'
import InactiveChatScreen from '../../../components/user/chat/ui/InactiveChatScreen'
import ProfileViewBar from '../../../components/user/sidebar/ProfileViewBar'

function Messaging() {
    return (
        <div className="bg-white lg:bg-whiteOpacity02 min-h-screen flex flex-col overflow-hidden">
            {/* Navbar */}
            <Navbar />

            {/* Main Layout */}
            <div className="flex flex-grow lg:flex-row lg:px-2 lg:py-6">
                {/* Sidebar Section */}
                <div className="hidden lg:flex flex-col lg:px-4 lg:w-1/5 h-full">
                    <div className="space-y-4 h-[calc(100vh-56px)] overflow-y-auto rounded-lg pb-12">
                        {/* AdPreviewBar */}
                        <ProfileViewBar />

                        {/* Sidebar */}
                        <Sidebar />
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 w-full lg:w-3/5 lg:mx-3 lg:rounded-lg h-full overflow-y-auto">
                    {/* Profile Card */}
                    <InactiveChatScreen />
                </div>
            </div>
        </div>
    )
}

export default Messaging
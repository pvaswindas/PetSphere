import ChatSidebar from '../elements/sidebar/ChatSidebar'
import ChatArea from '../elements/ChatArea'

function ActiveChatScreen() {

    return (
        <div className="flex w-full bg-gradient-to-tr from-teal-50 to-amber-100 h-full lg:h-[615px]">
            <div className="hidden lg:flex lg:w-1/3">
                <ChatSidebar />
            </div>
            <div className="lg:w-full flex-grow">
                <ChatArea />
            </div>
        </div>
    )
}

export default ActiveChatScreen
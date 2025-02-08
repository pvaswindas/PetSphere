import React, { useState, useEffect } from 'react';
import { getConversation } from '../../../utils/ChatsUtils';
import userAvatar from "../../../assets/icon/user-avatar.svg"
import AlertSnackbar from '../../Snackbar/AlertSnackbar';
import { useNavigate } from 'react-router-dom';
import { formatTime } from '../../../utils/formatTime';

function MessageBar() {
    const [searchTerm, setSearchTerm] = useState('');
    const [conversations, setConversations] = useState([]);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const navigate = useNavigate()

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const data = await getConversation();
                setConversations(data);
            } catch (error) {
                setSnackbarMessage("Unable to get conversations");
                setSnackbarOpen(true);
            }
        };

        fetchConversations();
    }, []);

    const filteredConversations = conversations.filter(conversation => 
        conversation.other_user.user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-80 h-[610px] bg-white shadow-md rounded-lg py-4 px-6 flex flex-col">
            <AlertSnackbar
                open={snackbarOpen}
                message={snackbarMessage}
                alert_type="error"
                onClose={() => setSnackbarOpen(false)}
            />
            <h3 className='text-blackOpacity85 font-medium'>Messages</h3>
            {/* Search bar */}
            <div className={`flex items-center py-1 px-2 bg-[#B9B9B9]/15 rounded-md my-3`}>
                <input
                    id="message-search"
                    name="message-search"
                    type="text"
                    autoComplete="off"
                    placeholder="Search for message"
                    className="flex-1 bg-transparent focus:outline-none px-1 text-gray-500 placeholder-lightTextGrey"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <hr />

            {/* Message list */}
            <div className="max-h-80 overflow-y-auto flex-grow">
                {filteredConversations.map(conversation => (
                    <div 
                        key={conversation.conversation_id} 
                        className="flex items-center py-3 cursor-pointer"
                        onClick={() => navigate(`/messages/chat/${conversation.other_user.user.username}`)}
                    >
                        {/* Profile picture */}
                        <img 
                            src={conversation?.other_user.profile_picture ? conversation.other_user.profile_picture : userAvatar} 
                            alt={conversation.other_user.user.username} 
                            className="w-10 h-10 min-w-10 min-h-10 rounded-full object-cover overflow-hidden mr-3"
                        />
                        <div className="flex-grow">
                            <span className="font-semibold text-blackOpacity85 block">{
                                conversation?.other_user.user.name ? conversation.other_user.user.name : "Anonymous User"
                            }</span>
                            {conversation && conversation.last_message && (
                                <div className="text-sm text-gray-600 flex justify-between whitespace-nowrap w-full">
                                    <span className="truncate max-w-[150px]">
                                        {conversation.last_message.length > 35 
                                            ? `${conversation.last_message.substring(0, 35)}...` 
                                            : conversation.last_message}
                                    </span>
                                    <span className="text-[0.6rem] text-gray-500 ml-2">{formatTime(conversation.last_message_timestamp, true)}</span>
                                </div>
                            )}
                        </div>
                        <div className='flex items-center'>
                            {/* New message indicator */}
                            {conversation.unread_count > 0 && (
                                <span className="flex items-center justify-center text-xs text-white bg-teal-500 p-1 w-5 h-5 text-center rounded-full ml-2">
                                    {conversation.unread_count > 99 ? '+99' : conversation.unread_count}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* View All link at the bottom */}
            <div className="mt-auto text-left text-sm">
                <a href="/messages" className="text-teal-700 hover:text-teal-500">View All</a>
            </div>
        </div>
    );
}

export default MessageBar;

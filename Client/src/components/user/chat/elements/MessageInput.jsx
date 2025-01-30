import React from 'react';
import { Send } from 'lucide-react';

const MessageInput = ({ message, setMessage, onSend }) => {
    return (
        <form onSubmit={onSend} className="p-6 bg-white backdrop-blur-md border-t-2 border-gray-50 rounded-br-lg">
            <div className="flex items-center h-[30px] space-x-4">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 p-2 rounded-full focus:outline-none ring-2 ring-teal-400 transition-all"
                />
                <button
                    type="submit"
                    className="w-10 flex justify-center h-10 rounded-xl bg-gradient-to-r items-center from-teal-500 to-purple-400 text-white hover:shadow-lg hover:opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                >
                    <Send size={20} />
                </button>
            </div>
        </form>
    );
};

export default MessageInput;

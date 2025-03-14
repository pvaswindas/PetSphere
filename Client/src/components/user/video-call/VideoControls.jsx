import React from "react";
import { Video, PhoneOff } from "lucide-react";

const CallControls = ({ onStartCall, onEndCall, isCalling }) => {
    return (
        <div className="flex gap-4 justify-center mt-6">
            {!isCalling ? (
                <button
                    onClick={onStartCall}
                    className="flex items-center gap-2 bg-green-500 text-xs lg:text-sm text-white px-6 py-2 rounded-full shadow-lg hover:bg-green-600 transition"
                >
                    <Video className="w-5 h-5" />
                    Start Call
                </button>
            ) : (
                <button
                    onClick={onEndCall}
                    className="flex items-center gap-2 bg-red-500 text-xs lg:text-sm text-white px-6 py-2 rounded-full shadow-lg hover:bg-red-600 transition"
                >
                    <PhoneOff className="w-5 h-5" />
                    End Call
                </button>
            )}
        </div>
    );
};

export default CallControls;

import React, { useState, useEffect } from "react";
import { PhoneCall, PhoneOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../axios/axiosinstance";
import websocketServiceInstance from "../../../services/WebSocketService";

function IncomingCallPanel() {
    const [isCallIncoming, setIsCallIncoming] = useState(false);
    const [caller, setCaller] = useState(null);
    const navigate = useNavigate();

    const handleAcceptCall = async () => {
        try {
            await axiosInstance.post('video-call/accept-call/', {
                caller_username: caller.username
            });
    
            websocketServiceInstance.sendMessage({
                type: "call_accepted",
                caller: caller.username
            });
            
            navigate(`/video-call/${caller.username}`, { state: { isCaller: false } });
            setIsCallIncoming(false);
        } catch (error) {
            setIsCallIncoming(false);
        }
    };

    const handleRejectCall = async () => {
        try {
            await axiosInstance.post('video-call/reject-call/', {
                caller_username: caller.username
            });
    
            websocketServiceInstance.sendMessage({
                type: "call_rejected",
                caller: caller.username
            });

            setIsCallIncoming(false);
        } catch (error) {
            setIsCallIncoming(false);
        }
    };    

    useEffect(() => {
        // Subscribe to call notifications
        const unsubscribe = websocketServiceInstance.subscribe('call_notification', (data) => {
            setCaller(data.caller);
            setIsCallIncoming(true);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <AnimatePresence>
            {isCallIncoming && caller && (
                <motion.div 
                    initial={{ opacity: 0, y: -50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -50, scale: 0.9 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="fixed top-1 lg:top-16 right-1 lg:right-4 z-50 bg-white shadow-md border border-gray-100 rounded-full p-3 flex justify-between items-center w-[98%] lg:w-72"
                >
                    <span className="w-9 h-9 bg-black rounded-full overflow-hidden">
                        <img
                            src={caller.profile_picture || "/default-avatar.png"} 
                            alt={caller.username}
                            className="rounded-full object-cover w-full h-full"
                            onError={(e) => {
                                e.target.src = "/default-avatar.png";
                            }}
                        />
                    </span>
                    
                    <span className="flex flex-col font-medium items-center text-gray-600">
                        {caller.username} is calling...
                    </span>

                    <div className="flex space-x-2">
                        <motion.button 
                            className="rounded-full bg-green-500 p-2 hover:bg-green-600"
                            onClick={handleAcceptCall}
                            animate={{ x: [0, -3, 3, -3, 3, 0] }}
                            transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }}
                        >
                            <PhoneCall color="white" size={20} />
                        </motion.button>

                        <motion.button 
                            className="rounded-full bg-red-500 p-2 hover:bg-red-600"
                            onClick={handleRejectCall}
                            animate={{ opacity: [1, 0.7, 1] }}
                            transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
                        >
                            <PhoneOff color="white" size={20} />
                        </motion.button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default IncomingCallPanel;
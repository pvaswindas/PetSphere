import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import { PhoneCall, PhoneOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import userAvatar from "../../../assets/icon/user-avatar.svg"
import axiosInstance from "../../../axios/axiosinstance";

function IncomingCallPanel() {
    const [isCallIncoming, setIsCallIncoming] = useState(false);
    const [caller, setCaller] = useState(null);
    const socketRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);
    const pingIntervalRef = useRef(null);
    const navigate = useNavigate();

    const connectWebSocket = useCallback(() => {
        const token = localStorage.getItem("ACCESS_TOKEN");
        if (!token) return;

        if (socketRef.current) {
            socketRef.current.close();
        }

        const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
        socketRef.current = new WebSocket(`${wsProtocol}://${process.env.REACT_APP_API_SITE_URL}/ws/notifications/?token=${token}`);
        
        socketRef.current.onopen = function() {
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
                reconnectTimeoutRef.current = null;
            }
        };

        socketRef.current.onmessage = function(event) {
            try {
                console.log('WebSocket message received:', event.data);
                
                if (event.data === "ping") {
                    socketRef.current.send("pong");
                    return;
                }
                
                const data = JSON.parse(event.data);

                if (data.type === "call_notification") {
                    setCaller(data.caller);
                    setIsCallIncoming(true);
                } else if (data.type === "pong") {
                    console.log('Pong received from server');
                }
            } catch (error) {
                console.error('Error parsing WebSocket message:', error, event.data);
            }
        };

        socketRef.current.onerror = function(error) {
            console.error('WebSocket error:', error);
        };

    }, []);

    const handleAcceptCall = async () => {
        try {
            await axiosInstance.post('video-call/accept-call/', {
                caller_username: caller.username
            });
    
            if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                socketRef.current.send(JSON.stringify({
                    type: "call_accepted",
                    caller: caller.username
                }));
            }
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
    
            if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                socketRef.current.send(JSON.stringify({
                    type: "call_rejected",
                    caller: caller.username
                }));
            }
    
            setIsCallIncoming(false);
        } catch (error) {
            setIsCallIncoming(false);
        }
    };    

    useEffect(() => {
        connectWebSocket();

        return () => {
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
                reconnectTimeoutRef.current = null;
            }
            
            if (pingIntervalRef.current) {
                clearInterval(pingIntervalRef.current);
                pingIntervalRef.current = null;
            }
            
            if (socketRef.current) {
                socketRef.current.close();
                socketRef.current = null;
            }
        };
    }, [connectWebSocket]);

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
                            src={caller.profile_picture || userAvatar} 
                            alt={caller.username}
                            className="rounded-full object-cover w-full h-full"
                            onError={(e) => {
                                e.target.src = userAvatar;
                            }}
                        />
                    </span>
                    
                    <span className="flex flex-col font-medium text-xs lg:text-sm items-center text-gray-600">
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

export default memo(IncomingCallPanel);
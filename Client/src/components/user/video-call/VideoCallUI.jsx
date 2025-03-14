import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import VideoScreen from "./VideoScreen";
import axiosInstance from "../../../axios/axiosinstance";

const VideoCallUI = ({ isCaller = false }) => {
    const { username } = useParams();
    const navigate = useNavigate();
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const peerConnection = useRef(null);
    const socket = useRef(null);
    const localStreamRef = useRef(null);
    const [isCalling, setIsCalling] = useState(false);
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [isMicOn, setIsMicOn] = useState(true);
    const [callEnded, setCallEnded] = useState(false);
    const [callStatus, setCallStatus] = useState("available");

    const initiateCall = async (calleeUsername) => {
        try {
            await axiosInstance.post('notification/initiate-call/', {
                callee: calleeUsername
            });
        } catch (error) {
            return;
        }
    };

    const handleRemoteEndCall = useCallback(() => {
        if (peerConnection.current) {
            peerConnection.current.close();
            peerConnection.current = null;
        }

        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((track) => track.stop());
            localStreamRef.current = null;
        }

        setIsCalling(false);
        setCallEnded(true);

        setTimeout(() => {
            navigate(`/messages/chat/${username}`);
        }, 1000);
    }, [navigate, username]);

    // Function to fetch Twilio TURN credentials
    const fetchTwilioCredentials = async () => {
        try {
            const response = await axiosInstance.get('video-call/get-turn-credentials/');
            return response.data.ice_servers;
        } catch (error) {
            // Fallback to Google's STUN server only
            return [{ urls: "stun:stun.l.google.com:19302" }];
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("ACCESS_TOKEN");
        if (!token) return;

        const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
    
        socket.current = new WebSocket(`${wsProtocol}://${process.env.REACT_APP_API_SITE_URL}/ws/video_call/${username}/?token=${token}`);

        // socket.current.onopen = () => {
            
        // };

        socket.current.onmessage = async (event) => {
            const data = JSON.parse(event.data);

            if (data.type === "call_rejected") {
                alert("Call rejected by the receiver.");
            }

            if (data.type === "call-status") {
                setCallStatus(data.status);
            }
    
            if (data.type === "offer") {
                await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.offer));
                const answer = await peerConnection.current.createAnswer();
                await peerConnection.current.setLocalDescription(answer);
                sendMessage({ type: "answer", answer });
            }
    
            if (data.type === "answer") {
                await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.answer));
            }
    
            if (data.type === "candidate") {
                await peerConnection.current.addIceCandidate(new RTCIceCandidate(data.candidate));
            }
    
            if (data.type === "call-ended") {
                handleRemoteEndCall();
            }
        };
    
        return () => {
            if (socket.current) {
                socket.current.close();
            }
        };
    }, [username, handleRemoteEndCall, isCaller]);
    
    const sendMessage = (message) => {
        if (socket.current && socket.current.readyState === WebSocket.OPEN) {
            socket.current.send(JSON.stringify(message));
        }
    };

    const requestPermissionsAndStartCall = async () => {
        try {
            if (isCaller) {
                initiateCall(username);
            }
            const localStream = await navigator.mediaDevices.getUserMedia({ 
                video: true,
                audio: {
                    echoCancellation: true,
                    noiseSuppression:true,
                    autoGainControl:true
                }
            });
            localStreamRef.current = localStream;
            startCall(localStream);
        } catch (error) {
            alert("An error occurred while trying to access your camera and microphone.");
        }
    };

    const startCall = async (localStream) => {
        setIsCalling(true);
        
        // Fetch TURN server credentials
        const iceServers = await fetchTwilioCredentials();
        
        // Create RTCPeerConnection with Twilio credentials
        peerConnection.current = new RTCPeerConnection({ 
            iceServers: iceServers,
            iceCandidatePoolSize: 10
        });

        // Add connection state monitoring
        peerConnection.current.oniceconnectionstatechange = () => {
            if (peerConnection.current.iceConnectionState === "failed" || 
                peerConnection.current.iceConnectionState === "disconnected") {
            }
        };

        peerConnection.current.onicecandidate = (event) => {
            if (event.candidate) {
                sendMessage({ type: "candidate", candidate: event.candidate });
            }
        };

        peerConnection.current.ontrack = (event) => {
            remoteVideoRef.current.srcObject = event.streams[0];
        };

        localVideoRef.current.srcObject = localStream;
        localStream.getTracks().forEach((track) => peerConnection.current.addTrack(track, localStream));

        const offer = await peerConnection.current.createOffer();
        await peerConnection.current.setLocalDescription(offer);
        sendMessage({ type: "offer", offer });
    };

    const toggleCamera = () => {
        const videoTrack = localStreamRef.current?.getVideoTracks()[0];
        if (videoTrack) {
            videoTrack.enabled = !videoTrack.enabled;
            setIsCameraOn(videoTrack.enabled);
        }
    };

    const toggleMic = () => {
        const audioTrack = localStreamRef.current?.getAudioTracks()[0];
        if (audioTrack) {
            audioTrack.enabled = !audioTrack.enabled;
            setIsMicOn(audioTrack.enabled);
        }
    };

    const endCall = () => {
        if (peerConnection.current) {
            peerConnection.current.close();
            peerConnection.current = null;
        }
    
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((track) => track.stop());
            localStreamRef.current = null;
        }
    
        sendMessage({ type: "call-ended" });
    
        setIsCalling(false);
        setCallEnded(true);
    
        setTimeout(() => {
            navigate(`/messages/chat/${username}`);
        }, 2000);
    };    

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-900 p-4">
            {callEnded ? (
                <div className="text-white text-xl font-semibold">Call Ended...</div>
            ) : (
                <VideoScreen 
                    localVideoRef={localVideoRef} 
                    remoteVideoRef={remoteVideoRef} 
                    onStartCall={requestPermissionsAndStartCall} 
                    onEndCall={endCall} 
                    isCalling={isCalling} 
                    toggleCamera={toggleCamera} 
                    toggleMic={toggleMic} 
                    isCameraOn={isCameraOn} 
                    isMicOn={isMicOn}
                    callStatus={callStatus}
                />
            )}
        </div>
    );
};

export default VideoCallUI;
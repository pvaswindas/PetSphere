import React from "react";
import { useParams } from "react-router-dom";
import { Video, PhoneOff, User, Mic, MicOff, VideoOff } from "lucide-react";

const VideoScreen = ({ localVideoRef, remoteVideoRef, onStartCall, onEndCall, isCalling, toggleCamera, toggleMic, isCameraOn, isMicOn, callStatus }) => {
    const { username } = useParams();
    return (
        <div className="relative flex items-center justify-center w-full lg:w-3/4 h-full lg:p-10">
            <div className="flex gap-1 absolute top-0 left-3 lg:left-10 items-center font-medium text-gray-300">
                <User />
                <h1 className="text-xl lg:text-2xl">{username}</h1>
            </div>
            
            <div className="w-full h-full bg-gray-900 lg:rounded-xl overflow-hidden">
                <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover bg-gray-800" />
            </div>
            
            <div className="absolute bottom-20 lg:top-16 right-2 lg:right-16 w-40 h-52 lg:w-60 lg:h-40 rounded-lg bg-gray-900">
                <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover rounded-lg" />
            </div>
            
            <div className="absolute bottom-6 lg:bottom-16 left-1/2 transform -translate-x-1/2 flex gap-4">
                <button onClick={toggleCamera} className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-lg transition ${isCameraOn ? "bg-gray-700 text-white" : "bg-red-500 text-white"}`}>
                    {isCameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </button>
                <button onClick={toggleMic} className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-lg transition ${isMicOn ? "bg-gray-700 text-white" : "bg-red-500 text-white"}`}>
                    {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </button>
                {!isCalling ? (
                    <button 
                        onClick={onStartCall} 
                        className="flex items-center gap-2 bg-green-500 text-white px-6 py-2 rounded-full shadow-lg hover:bg-green-600 transition"
                    >
                        <Video className="w-5 h-5" />
                        {callStatus === "ongoing" ? "Join Call" : "Start Call"}
                    </button>
                ) : (
                    <button 
                        onClick={onEndCall} 
                        className="flex items-center gap-2 bg-red-500 text-white px-6 py-2 rounded-full shadow-lg hover:bg-red-600 transition"
                    >
                        <PhoneOff className="w-5 h-5" />
                        End Call
                    </button>
                )}
            </div>
        </div>
    );
};

export default VideoScreen;

import { useEffect, useRef, useState } from "react";

const ICE_SERVERS = {
    iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
    ],
    };

    export const useWebRTC = (socket, isCaller) => {
    const peerConnection = useRef(null);
    const localStream = useRef(null);
    const remoteStream = useRef(new MediaStream());
    const [remoteVideoStream, setRemoteVideoStream] = useState(null);

    useEffect(() => {
        peerConnection.current = new RTCPeerConnection(ICE_SERVERS);

        peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
            socket.send(
            JSON.stringify({ type: "candidate", candidate: event.candidate })
            );
        }
        };

        peerConnection.current.ontrack = (event) => {
        remoteStream.current.addTrack(event.track);
        setRemoteVideoStream(remoteStream.current);
        };

        return () => {
        peerConnection.current?.close();
        };
    }, [socket]);

    const startCall = async () => {
        localStream.current = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
        });

        localStream.current.getTracks().forEach((track) => {
        peerConnection.current.addTrack(track, localStream.current);
        });

        if (isCaller) {
        const offer = await peerConnection.current.createOffer();
        await peerConnection.current.setLocalDescription(offer);
        socket.send(JSON.stringify({ type: "offer", offer }));
        }
    };

    const handleSignalingData = async (data) => {
        if (data.type === "offer") {
        await peerConnection.current.setRemoteDescription(
            new RTCSessionDescription(data.offer)
        );
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);
        socket.send(JSON.stringify({ type: "answer", answer }));
        } else if (data.type === "answer") {
        await peerConnection.current.setRemoteDescription(
            new RTCSessionDescription(data.answer)
        );
        } else if (data.type === "candidate") {
        await peerConnection.current.addIceCandidate(
            new RTCIceCandidate(data.candidate)
        );
        }
    };

    return { startCall, remoteVideoStream, handleSignalingData };
};

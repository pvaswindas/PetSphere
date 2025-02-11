import { useEffect, useState } from 'react';

const useChatSocket = (username, token, onMessageReceived) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (!username || !token) return;

        const ws = new WebSocket(`ws://localhost:8000/ws/chat/${username}/?token=${token}`);
        
        ws.onopen = () => console.log("WebSocket connection established!");
        ws.onerror = (err) => console.log("WebSocket error:", err);
        
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            onMessageReceived(data);
        };
        
        ws.onclose = () => {
            console.log("WebSocket Disconnected");
            setSocket(null);
        };
        
        setSocket(ws);

        return () => {
            ws.close();
        };
    }, [username, token, onMessageReceived]);

    return socket;
};

export default useChatSocket;

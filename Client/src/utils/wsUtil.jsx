export const chatWebSocket = (username, token, onMessage, onOpen, onClose, onError) => {
    if (!username || !token) return null;

    const ws = new WebSocket(`ws://localhost:8000/ws/chat/${username}/?token=${token}`);

    ws.onopen = () => {
        console.log("WebSocket connection established!");
        if (onOpen) onOpen(ws);
    };

    ws.onerror = (err) => {
        console.error("WebSocket error:", err);
        if (onError) onError(err);
    };

    ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            if (onMessage) onMessage(data);
        } catch (error) {
            console.error("Error parsing WebSocket message:", error);
        }
    };

    ws.onclose = () => {
        console.log("WebSocket Disconnected");
        if (onClose) onClose();
    };

    return ws;
};

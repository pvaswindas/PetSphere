export const chatWebSocket = (username, token, onMessage, onOpen, onClose, onError) => {
    if (!username || !token) return null;

    const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
    const ws = new WebSocket(`${wsProtocol}://${process.env.REACT_APP_API_SITE_URL}/ws/chat/${username}/?token=${token}`);

    ws.onopen = () => {
        if (onOpen) onOpen(ws);
    };

    ws.onerror = (err) => {
        if (onError) onError(err);
    };

    ws.onmessage = (event) => {
        if (!event.data) {
            return;
        }
        
        try {
            const data = JSON.parse(event.data);
            
            // Add validation to ensure the message has content before forwarding
            if (data && (data.message || data.type !== "ping")) {
                if (onMessage) onMessage(data);
            }
        } catch (error) {
            if (onError) onError(error);
        }
    };

    ws.onclose = (event) => {
        if (onClose) onClose(event);
    };

    // Keep connection alive with ping (optional)
    const pingInterval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: "ping" }));
        }
    }, 30000);

    // Return an object with the WebSocket and a cleanup method
    return {
        socket: ws,
        close: () => {
            clearInterval(pingInterval);
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        }
    };
};
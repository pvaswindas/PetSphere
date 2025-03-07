// wsUtil.js
export const chatWebSocket = (username, token, onMessage, onOpen, onClose, onError) => {
    // Use secure WebSocket if on HTTPS
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//${process.env.REACT_APP_API_SITE_URL}/ws/chat/${username}/?token=${token}`;
    
    let ws;
    try {
        ws = new WebSocket(wsUrl);
        
        ws.onopen = () => {
            console.log(`WebSocket connection established to ${username}`);
            if (onOpen) onOpen(ws);
        };
        
        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (onMessage) onMessage(data);
            } catch (error) {
                console.error("Failed to parse WebSocket message:", error);
            }
        };
        
        ws.onclose = (event) => {
            console.log(`WebSocket connection closed: ${event.code} ${event.reason}`);
            if (onClose) onClose(event);
        };
        
        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
            if (onError) onError(error);
        };
        
        // Add a ping function to keep the connection alive
        ws.ping = () => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ type: "ping" }));
            }
        };
        
        // Add connection status check
        ws.isConnected = () => {
            return ws.readyState === WebSocket.OPEN;
        };
        
        return ws;
    } catch (error) {
        console.error("Error creating WebSocket:", error);
        if (onError) onError(error);
        return null;
    }
};
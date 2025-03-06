export const chatWebSocket = (username, token, onMessage, onOpen, onClose, onError) => {
    if (!username || !token) return null;

    const ws = new WebSocket(`wss://${process.env.REACT_APP_API_SITE_URL}/ws/chat/${username}/?token=${token}`);

    ws.onopen = () => {
        if (onOpen) onOpen(ws);
    };

    ws.onerror = (err) => {
        if (onError) onError(err);
    };

    ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            if (onMessage) onMessage(data);
        } catch (error) {
            if (onError) onError(error);
        }
    };

    ws.onclose = () => {
        if (onClose) onClose();
    };

    return ws;
};

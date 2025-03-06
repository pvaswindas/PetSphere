const socket = new WebSocket(`wss://${process.env.REACT_APP_API_SITE_URL}/ws/notifications/`);

socket.onmessage = function (event) {
    const data = JSON.parse(event.data);

    if (data.type === "call_notification") {
        
    }
};

socket.onclose = function () {

};

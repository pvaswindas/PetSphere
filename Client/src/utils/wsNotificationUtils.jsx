const socket = new WebSocket("ws://localhost:8000/ws/notifications/");

socket.onmessage = function (event) {
    const data = JSON.parse(event.data);

    if (data.type === "call_notification") {
        
    }
};

socket.onclose = function () {

};

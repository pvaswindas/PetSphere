const socket = new WebSocket("ws://13.51.205.208/ws/notifications/");

socket.onmessage = function (event) {
    const data = JSON.parse(event.data);

    if (data.type === "call_notification") {
        
    }
};

socket.onclose = function () {

};

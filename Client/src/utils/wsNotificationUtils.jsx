const socket = new WebSocket("ws://localhost:8000/ws/notifications/");

socket.onmessage = function (event) {
    const data = JSON.parse(event.data);

    if (data.type === "call_notification") {
        console.log(data)
    }
};

socket.onclose = function () {
    console.log("WebSocket closed");
};

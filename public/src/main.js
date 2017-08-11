
function Setup(options) {
    var container = document.getElementById("container");

    var host = window.location.hostname;
    var port = window.location.port;

    //Initialization logic
    ws = new WebSocket("ws://" + host + ":" + port);
    ws.addEventListener("open", function(e) {
        console.log("Connected to %s:%s", host, port);
        ws.send(new Message("handshake", options).stringify());
    });
    ws.addEventListener("message", function(a_message) {
        var d = a_message.data;
        var m = Message.parse(d);
        console.log(m);
        switch(m.type) {
            case "view": {
                container.innerHTML = m.data;
            }
            break;
        }
    })
}
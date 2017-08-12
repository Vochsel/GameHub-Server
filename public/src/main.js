
function Setup(options) {
    if(!options)
        options = {};
    
    var container = document.getElementById("container");

    var host = window.location.hostname;
    var port = window.location.port;

    var windowURL = new URL(window.location.href);
    var role = windowURL.searchParams.get('role');
    var type = windowURL.searchParams.get('type');

    if(role) {
        console.log("Found role in URL. Role: %s.", role);
        options.role = role;
    }

    if(type) {
        console.log("Found type in URL. Type: %s.", type);
        options.type = type;
    }

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
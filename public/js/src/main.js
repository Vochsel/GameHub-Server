
function Setup(options) {
    if(!options)
        options = {};

    var container = document.getElementById("container");

    var host = window.location.hostname;
    var port = window.location.port;

    var windowURL = new URL(window.location.href);
    var role = windowURL.searchParams.get('role');
    var type = windowURL.searchParams.get('type');
    var name = windowURL.searchParams.get('name');

    if(role) {
        console.log("Found role in URL. Role: %s.", role);
        options.role = role;
    }

    if(type) {
        console.log("Found type in URL. Type: %s.", type);
        options.type = type;
    }

    if(name) {
        console.log("Found type in URL. Name: %s.", name);
        options.name = name;
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
                SetupInput();
            }
            break;
        }
    })

    
}

function SetupInput() {
    // -- Input
    var inputs = document.getElementsByTagName("input");
    for(var i = 0; i < inputs.length; i++) {
        var input = inputs[i];
        console.log(input);
        input.addEventListener("click", inputHandle);
    }
}

function inputHandle(e) {
    console.log(e.target);
    if(e.target.type !== "button")
        return;
    var inputValues = {};
    var allInputs = document.getElementsByTagName("input");
    for(var i = 0; i < allInputs.length; i++) {
        var input = allInputs[i];
        var inputID = input.getAttribute('data-id');
        if(inputID) {
            if(input.type === "text") {
                inputValues[inputID] = input.value;
            } else {
                if(input.getAttribute('data-value')) {
                    inputValues[inputID] = input.getAttribute('data-value');
                }
            }
        }
    }

    var action = input.getAttribute("data-action");
    action = action.replace('(', '');
    action = action.replace(')', '');
    
    var functionName = action;

    ws.send(new Message("controller", {action: functionName, data: inputValues}).stringify());
}
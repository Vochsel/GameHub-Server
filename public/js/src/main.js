function hideAddressBar(){
    if(document.documentElement.scrollHeight<window.outerHeight/window.devicePixelRatio)
        document.documentElement.style.height=(window.outerHeight/window.devicePixelRatio)+'px';
    setTimeout(window.scrollTo(1,1),1);
    console.log("HIDDEN");
}
//window.addEventListener("load",function(){hideAddressBar();});
window.addEventListener("orientationchange",function(){hideAddressBar();});

function getQueryParams(qs) {
    qs = qs.split('+').join(' ');

    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }

    return params;
}

function Setup(options) {
    //hideAddressBar();
    if(!options)
        options = {};

    var container = document.getElementById("container");

    var host = window.location.hostname;
    var port = window.location.port;

    //var windowURL = new URL(window.location.href);
    //var role = windowURL.searchParams.get('role');
    //var type = windowURL.searchParams.get('type');
    //var name = windowURL.searchParams.get('name');
    var windowURL = getQueryParams(window.location.search);
    var role = windowURL.role;
    var type = windowURL.type;
    var name = windowURL.name;

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

function GetInputs() {
    var i = document.getElementsByTagName("input");
    //console.log(i);
    var j = document.getElementsByClassName('button');
    //console.log(j);
    var cat = Array.from(i).concat(Array.from(j));
    console.log(cat);
    return cat;
}

function SetupInput() {
    // -- Input
    var inputs = document.getElementsByTagName("input");
    
    inputs = GetInputs();

    for(var i = 0; i < inputs.length; i++) {
        var input = inputs[i];
        console.log(input);
        
        input.addEventListener("click", inputHandle);
    }
}

function inputHandle(e) {
    if(e.target.type === "button" || e.target.className === "button") {
        var inputValues = {};
        var allInputs = document.getElementsByTagName("input");
        allInputs = GetInputs();
        for(var i = 0; i < allInputs.length; i++) {
            var input = allInputs[i];
            if(input.type === "button" || input.className === "button")
                continue;
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
        var inputID = e.target.getAttribute('data-id');
        if(inputID) {
            if(e.target.type === "text") {
                inputValues[inputID] = e.target.value;
            } else {
                if(e.target.getAttribute('data-value')) {
                    inputValues[inputID] = e.target.getAttribute('data-value');
                }
            }
        }

        var action = input.getAttribute("data-action");
        action = action.replace('(', '');
        action = action.replace(')', '');
        
        var functionName = action;
        console.log(inputValues);
        ws.send(new Message("controller", {action: functionName, data: inputValues}).stringify());
    }
}
function hideAddressBar() {
    if (document.documentElement.scrollHeight < window.outerHeight / window.devicePixelRatio)
        document.documentElement.style.height = (window.outerHeight / window.devicePixelRatio) + 'px';
    setTimeout(window.scrollTo(1, 1), 1);
    DebugLog("HIDDEN");
}
//window.addEventListener("load",function(){hideAddressBar();});
window.addEventListener("orientationchange", function () { hideAddressBar(); });

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
    if (!options)
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
    var uid = windowURL.uid;
    var debug = windowURL.debug;


    if (debug) {
        document.head.innerHTML += "<link href='css/debug.css' rel='stylesheet'/>";
        if(debug == 2)
            AddDebugLog();
        DebugLog("Debug connected!");
    }

    if (role) {
        DebugLog("Found role in URL. Role: " + role);
        options.role = role;
    }

    if (type) {
        DebugLog("Found type in URL. Type: " + type);
        options.type = type;
    }

    if (name) {
        DebugLog("Found name in URL. Name: " + name);
        options.name = name;
    }

    if(uid) {
        DebugLog("Found uid in URL. UID: " + uid);
        options.uid = uid;
    }


    //Initialization logic
    ws = new WebSocket("ws://" + host + ":" + port);
    ws.addEventListener("open", function (e) {
        DebugLog("Connected to " + host + " : " + port);
        SendWS(ws, new Message("handshake", options));
        setInterval(function () {
            SendWS(ws, new Message("ping", "Stayin' alive"));
        }, 30000);
        //ws.send(new Message("handshake", options).stringify());
    });
    ws.addEventListener("message", function (a_message) {
        var d = a_message.data;
        var m = Message.parse(d);
        DebugLog("RECIEVED MESSAGE: " + d, "red");
        switch (m.type) {
            case "view": {
                container.innerHTML = m.data;
                SetupInput();
            }
                break;
        }
    });
    //ws.addEventListener('close', function(e) {
       /* var checkInterval = setInterval(function () {
            //SendWS(ws, new Message("ping", "Stayin' alive"));
            
        }, 5000);*/
    //})
}

function GetInputs() {
    var i = document.getElementsByTagName("input");
    //DebugLog(i);
    var j = document.getElementsByClassName('button');
    //DebugLog(j);
    var cat = Array.from(i).concat(Array.from(j));
    // DebugLog(cat);
    return cat;
}

function HandleForms() {
    var forms = document.getElementsByTagName("form");
    for (var i = 0; i < forms.length; i++) {
        var f = forms[i];
        f.addEventListener('submit', function (v) {
            v.preventDefault();
            var formEl = v.target;
            var formInputs = formEl.children;
            for (var j = 0; j < formInputs.length; j++) {
                var input = formInputs[j];
                var inputVal = input.value;
                if (inputVal)
                    alert(inputVal);
            }
        })
    }
}

function SetupInput() {
    // -- Input
    var inputs = GetInputs();

    for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i];
        //DebugLog(input);

        input.addEventListener("click", inputHandle);
    }

    // -- Canvas
    allCanvas = document.getElementsByTagName("canvas");
    console.log("Found %s canvas'!", allCanvas.length);

    for (var i = 0; i < allCanvas.length; i++) {
        var can = allCanvas[i];
        SetupCanvas(can);
    }
}

var allCanvas = [];

function RepackageInputs(a_elements) {
    var newElements = new Object();

    // Loop through all elements to find the ones formatted correctly
    for(var i = 0; i < a_elements.length; i++) {
        var curInput = a_elements[i];
        // Get attribute ID - Should always exist
        var inputID = curInput.getAttribute('data-id');
        // Get attribute Val - Will be null if text field, canvas, etc.
        var inputVal = curInput.getAttribute('data-value');

        // Try and source other input values if needed
        if(!inputVal) {
            switch(curInput.type) {
                //If element is a text element
                case "text":
                    {
                        inputVal = curInput.value;
                    }
                    break;
                //If element is a button, or no other type has matched, set to True
                case "button":
                default:
                    {
                        inputVal = true;
                    }
                    break;
            }
        }

        // If element has ID and val, store into newElements
        if (inputID && inputVal) {
            newElements[inputID] = inputVal;
        }
    }

    return newElements;
}

function inputHandle(e) {
    if (e.target.type === "button" || e.target.className === "button") {
        var inputValues = {};
        var allInputs = document.getElementsByTagName("input");
        allInputs = GetInputs();
        for (var i = 0; i < allInputs.length; i++) {
            var input = allInputs[i];
            if (input.type === "button" || input.className === "button")
                continue;
            var inputID = input.getAttribute('data-id');
            if (inputID) {
                if (input.type === "text") {
                    inputValues[inputID] = input.value;
                } else {
                    if (input.getAttribute('data-value')) {
                        inputValues[inputID] = input.getAttribute('data-value');
                    }
                }
            }
        }
        var inputID = e.target.getAttribute('data-id');
        if (inputID) {
            if (e.target.type === "text") {
                inputValues[inputID] = e.target.value;
            } else {
                if (e.target.getAttribute('data-value')) {
                    inputValues[inputID] = e.target.getAttribute('data-value');
                }
            }
        }


        for (var i = 0; i < allCanvas.length; i++) {
            var inputID = allCanvas[i].getAttribute('data-id');
            if (inputID) {
                inputValues[inputID] = allCanvas[i].toDataURL();
            }
        }

        var action = e.target.getAttribute("data-action");
        action = action.replace('(', '');
        action = action.replace(')', '');
        console.log(action);

        var functionName = action;
        //DebugLog(inputValues);
        var msg = new Message("controller", { action: functionName, data: inputValues });

        //ws.send(msg.stringify());
        SendWS(ws, msg);
    }
}

function SendWS(a_ws, a_msg) {
    DebugLog("SENT MESSAGE: " + a_msg.stringify(), "blue");
    a_ws.send(a_msg.stringify());
}
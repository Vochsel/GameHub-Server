var globalDebugDiv = null;


function AddDebugLog() {
    var debugDiv = document.createElement("div");
    debugDiv.className = "debug_log";
    document.body.appendChild(debugDiv);
    globalDebugDiv = debugDiv;
    return debugDiv;
}

function DebugLog(a_message, a_color) {
    if(a_color === "") {
        a_color = "black";
    }
    console.log(a_message);
    if(globalDebugDiv) {
        if(a_message.outerHTML)
            a_message = a_message.outerHTML
        if(typeof a_message === "object")
            a_message = JSON.stringify(a_message);

        var debugP = document.createElement("p");
        debugP.style = "color: " + a_color;
        var debugText = document.createTextNode(a_message);
        debugP.appendChild(debugText);
        globalDebugDiv.appendChild(debugP);
        //globalDebugDiv.appendChild(document.createElement("br"));
        //globalDebugDiv.appendChild(document.createElement("br"));
        setTimeout(function() {
            globalDebugDiv.scrollTop = globalDebugDiv.scrollHeight;
        }, 150);
    }
}
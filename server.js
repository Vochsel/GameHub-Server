var DeviceManager = require('./libs/managers/deviceManager.js');
var ServerManager = require('./libs/managers/serverManager.js');
var Debug = require('./libs/debug.js');
var GameModeManager = require('./libs/gamemode.js').GameModeManager;

var Utils = require('./libs/utils.js');


var GH = require('./libs/gamehub.js');
var TestGM = require('./tests/TestGM/TestGM.js');

//var GHServerManager = new ServerManager();


//var gm = new TestGM();
//gm.start();

function Setup() {

    GH.deviceManager = new DeviceManager();
    GH.serverManager = new ServerManager();
    
    StartGM();
}

function StartGM() {
    GH.activeGameMode = new TestGM();
    GH.activeGameMode.start();
}

//Helper function to access sub objects by string
Object.byString = function(o, s) {
    if(typeof o !== 'object')
        return o;
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot
    var a = s.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        if (k in o) {
            o = o[k];
        } else {
            return;
        }
    }
    return o;
}
var lastInput = "";
var stdin = process.openStdin();
stdin.addListener("data", function(d) {
    var input = d.toString().trim();

    if(input.charCodeAt(0) === 27) {
        input = lastInput;
        console.log(input);
    }
    

    var o = Object.byString(GH, input);
    if(o) {
        lastInput = input;
        console.log(o);
    }

    var key = d.toString().trim();
    switch(key)
    {
        case 'c':
            {
                Debug.Log(GH.deviceManager.devices.size, "red");
                //gm.progressGameMode(); 
            }   
            break;
        case 'd':
            {
                gm.currentStage.execute();
            }
            break;
        case 'f':
            {
                StartGM();
            }
            break;
        case 's':
            {
                gm.stop(); 
            }   
            break;
       
    }
});

Setup();
/* Internal Dependencies */
var Debug           = require('./libs/utilities/debug.js');
var Utils           = require('./libs/utilities/utils.js');

var GH = require('./libs/gamehub.js');
var DeviceManager   = require('./libs/managers/deviceManager.js');
var ServerManager   = require('./libs/managers/serverManager.js');
var GMM   = require('./libs/managers/gameManager.js');
//var GameModeManager = require('./libs/game/gamemode.js').GameModeManager;

var TestGM          = require('./gamemodes/TestGM/TestGM.js');

const chalk         = require('chalk');

function Setup() {

    //Setup and start Managers
    GH.deviceManager = new DeviceManager();
    GH.serverManager = new ServerManager();
    
//    GMM.loadGameMode(__dirname + "/gamemodes/TrueFriends");
    GMM.loadGameMode(__dirname + "/gamemodes/WitsEnd");

    //Start GameMode
    //StartGM();
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
        case "reload" :
            {
                GMM.reloadActiveGameMode();
            }
            break;
        case 'c':
            {
                Debug.Log(GH.deviceManager.devices.size, "red");
                //gm.progressGameMode(); 
            }   
            break;
        case 'd':
            {
                Debug.Log(GH.activeGameMode.status());
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
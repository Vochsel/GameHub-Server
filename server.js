/* Internal Dependencies */
//var Debug           = require('./libs/utilities/debug.js');
var Utils           = require('gh-api').Utils;
var Debug           = require('gh-api').Debug;

var GH              = require('./libs/gamehub.js');
var DeviceManager   = require('./libs/managers/deviceManager.js');
var ServerManager   = require('./libs/managers/serverManager.js');
var GMManager       = require('./libs/managers/gamemodeManager.js');

const chalk         = require('chalk');

var flags = require('flags');

function Setup() {

    // -- Define and parse flags
    flags.defineString('gm', 'TrueFriends', 'Game Mode to Load');
    flags.defineBoolean('debug', false, 'Should server start in debug mode');
    
    flags.parse();

    var gmToLoad = flags.get('gm');
    var isDebug  = flags.get('debug');

    if(!isDebug) {
        Debug.ShouldLogToConsole = false;
        console.log = function(){}; 
    }

    //Setup and start Managers
    GH.deviceManager = new DeviceManager();
    GH.serverManager = new ServerManager();

    //TODO: Easy fix...
    Utils.GH_API.GH.System = new Object();
    Utils.GH_API.GH.System.deviceManager = GH.deviceManager;

    var gmmanager = new GMManager(__dirname + "/gamemodes/" + gmToLoad + "/" + gmToLoad + ".json");
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

    var key = d.toString().trim().split(' ');
    switch(key[0])
    {
        case "load" :
            if(key.length > 1)
                var gmToLoad = key[1];
                console.log("Loading %s", gmToLoad);
                //GMM.loadGameMode(__dirname + "/gamemodes/" + gmToLoad);
                var gmmanager = new GMManager(__dirname + "/gamemodes/" + gmToLoad + "/" + gmToLoad + ".json");
                GH.GMManager = gmmanager;
            break;
        case "reload" :
            {
                var oldgmms = GH.GMManager.gmms;
                Debug.Log(oldgmms);
                var gmmanager = new GMManager(GH.activeGameMode.src, oldgmms);
                GH.GMManager = gmmanager;
            }
            break;
        case 'p':
            GH.GMManager.NextState();
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
/* Internal Dependencies */
var Debug           = require('./libs/utilities/debug.js');
var Utils           = require('gh-api').Utils;

var GH              = require('./libs/gamehub.js');
var DeviceManager   = require('./libs/managers/deviceManager.js');
var ServerManager   = require('./libs/managers/serverManager.js');
var GMM             = require('./libs/managers/gameManager.js');

const chalk         = require('chalk');

function Setup() {

    //Setup and start Managers
    GH.deviceManager = new DeviceManager();
    GH.serverManager = new ServerManager();

    //TODO: Easy fix...
    Utils.GH_API.GH.System = new Object();
    Utils.GH_API.GH.System.deviceManager = GH.deviceManager;

    var gmToLoad = "WitsEnd";

    if(Utils.Valid(process.argv[2]))
        gmToLoad = process.argv[2];

    GMM.loadGameMode(__dirname + "/gamemodes/" + gmToLoad + "/" + gmToLoad + ".json");
    
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
                GMM.loadGameMode(__dirname + "/gamemodes/" + gmToLoad);
            break;
        case "reload" :
            {
                var gm = GMM.loadGameMode(GH.activeGameMode.src);
                /*var gm = GMCompiler.Compile(GH.activeGameMode.path, function(gmExport) {
                    gmExport.log();
            
                    GH.activeGameMode = gmExport;
                    //GH.activeGameMode.path = a_path;
                    GH.activeGameMode.start();
                });*/
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
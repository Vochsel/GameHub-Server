/* Internal Dependencies */
//var Debug           = require('./libs/utilities/debug.js');
var Utils           = require('gh-api').Utils;
var util           = require('util');
var Debug           = require('gh-api').Debug;

var GH              = require('./libs/gamehub.js');
var DeviceManager   = require('./libs/managers/deviceManager.js');
var ServerManager   = require('./libs/managers/serverManager.js');
var GMManager       = require('./libs/managers/gamemodeManager.js');

const chalk         = require('chalk');

var flags = require('flags');

const path = require("path");
const fs = require("fs");

function Setup() {

    // -- Define and parse flags
    flags.defineString('gm', 'WitsEnd', 'Game Mode to Load');
    flags.defineBoolean('debug', false, 'Should server start in debug mode');
    
    flags.parse();

    var gmToLoad = flags.get('gm');
    var isDebug  = flags.get('debug');

    if(!isDebug) {
        Debug.ShouldLogToConsole = false;
    }
    
    //Debug.DebugFlags = ["state", "stage"];


    //Setup and start Managers
    GH.deviceManager = new DeviceManager();
    GH.serverManager = new ServerManager();

    //TODO: Easy fix...
    Utils.GH_API.GH.System = new Object();
    Utils.GH_API.GH.System.deviceManager = GH.deviceManager;

    var gmmanager = new GMManager(__dirname + "/gamemodes/" + gmToLoad + "/" + gmToLoad + ".json");
}

var lastInput = "";
var stdin = process.openStdin();
stdin.addListener("data", function(d) {
    var input = d.toString().trim();

    if(input.charCodeAt(0) === 27) {
        input = lastInput;
        console.log(input);
    }

    var o = Utils.AccessObjectWithString(GH, input);
    if(o) {
        lastInput = input;
        console.log(o);
    }

    var key = d.toString().trim().split(' ');
    switch(key[0])
    {
        case "devices":
            {
                console.log(GH.deviceManager.devices.keys());
            }
            break;
        case "gmload": 
            {
                var gmsrc = path.resolve(GH.activeGameMode.path + "/../" + key[1] + "/" + key[1] + ".json");
                console.log(gmsrc);
                var gmmanager = new GMManager(gmsrc);
                GH.GMManager = gmmanager;
            }
            break;
        case "load" :
            if(key.length > 1)
                var gmToLoad = key[1];

                Utils.LoadFileAsync("./saves/" + gmToLoad + ".json", false, false).then(value => {
                    console.log(value.content);
                    var loadGmms = JSON.parse(value.content);
                    
                    console.log("Loading %s", gmToLoad);
                    
                    var gmmanager = new GMManager(loadGmms.gmSrc, loadGmms);
                    GH.GMManager = gmmanager;

                    //TODO: reset device role on load?
                });

            break;
        case "hardreload" :
            {
                GH.GMManager.SaveProgress();
                var oldgmms = GH.GMManager.gmms;
                var gmmanager = new GMManager(oldgmms.gmSrc);
                GH.GMManager = gmmanager;
            }
            break;
        case "reload" :
            {
                GH.GMManager.SaveProgress();
                var oldgmms = GH.GMManager.gmms;
                //console.log(oldgmms);
                var gmmanager = new GMManager(oldgmms.gmSrc, oldgmms);
                GH.GMManager = gmmanager;
            }
            break;

        case "save" :
            {
                GH.GMManager.SaveProgress();
                var oldgmms = GH.GMManager.gmms;
                console.log(util.inspect(oldgmms, false, 5));
                var gmmanager = new GMManager(oldgmms.gmSrc, oldgmms);

                var saveFileName = key[1];
                if(!saveFileName)
                    saveFileName = "Untitled";
                
                fs.writeFile("./saves/" + saveFileName + ".json", JSON.stringify(oldgmms), function(err) {
                    if(err) {
                        return console.log(err);
                    }
                
                    console.log("The file was saved!");
                }); 

               // GH.GMManager = gmmanager;
            }
            break;

        case "hardreload" :
            {
                var gmmanager = new GMManager(GH.activeGameMode.src);
                GH.GMManager = gmmanager;
            }
            break;
        case 'p':
            GH.GMManager.NextState();
            break;
        case 'gmms':
            {
                Debug.Log(GH.GMManager.gmms);
            }
            break;
        case 'currentStage':
            {
                Debug.Log(GH.GMManager.CurrentStageObject);
            }
            break;
        case 'currentState':
            {
                Debug.Log(GH.GMManager.CurrentStateObject);
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
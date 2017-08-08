var DeviceManager = require('./libs/managers/deviceManager.js');
var ServerManager = require('./libs/managers/serverManager.js');
var Debug = require('./libs/debug.js');
var GameModeManager = require('./libs/gamemode.js').GameModeManager;

var Utils = require('./libs/utils.js');

var TestGM = require('./tests/TestGM/TestGM.js');

var GH = require('./libs/gamehub.js');

//var GHServerManager = new ServerManager();


//var gm = new TestGM();
//gm.start();

function Setup() {
    GH.deviceManager = new DeviceManager();
    GH.serverManager = new ServerManager();
    
    Start();
}

function Start() {

}

var stdin = process.openStdin();
stdin.addListener("data", function(d) {
    var key = d.toString().trim();
    switch(key)
    {
        case 'c':
            {
                gm.progressGameMode(); 
            }   
            break;
        case 'd':
            {
                gm.currentStage.execute();
            }
            break;
        case 'f':
            {
                gm.currentStage.currentState.execute();
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
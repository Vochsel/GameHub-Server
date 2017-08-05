var Debug = require('./libs/debug.js');
var GameModeManager = require('./libs/gamemode.js').GameModeManager;

var Utils = require('./libs/utils.js');

var TestGM = require('./tests/TestGM/TestGM.js');

var gm = new TestGM();
gm.start();

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

// -- External Dependencies
const EventEmitter  = require('events');
const fs            = require('fs');
const Eval          = require('safe-eval');

// -- Internal Dependencies
const Utils         = require('../utilities/utils.js');
const Debug         = require('../utilities/debug.js');
const Compiler      = require('../game/compiler.js');
const GH            = require('../gamehub.js');

class GameManager extends EventEmitter {
    constructor() {
        super();

        this.activeGameMode = null;
    }

    static reloadActiveGameMode() {
        GameManager.loadGameMode(GH.activeGameMode.path);
    }

    static loadGameMode(a_path) {

        var pathDir = a_path.split('/');
        var gmName = pathDir[pathDir.length - 1];
        
        fs.readFile(a_path + '/' + gmName + ".js", function read(a_err, a_data) {
            Debug.Log("[GMManager] Loading GameMode at path: " + a_path, "cyan");

            //Error loading file
            if (a_err) {
                //Log out error message
                Debug.Error("[GMManager] Error reading GameMode!");
                Debug.Error("[GMManager] " + a_err);

                //Throw Error?
                throw a_err;
            }

            //Store file contents
            var source = a_data;

            var loadedGM = Eval(source, Compiler.CreateContext());

            GH.deviceManager.devices.forEach(function(device) {
                device.role = device.initialRole;
            }, this);

            Debug.Log("[GMManager] Loaded GameMode!", "cyan");
            GH.activeGameMode = new loadedGM();
            GH.activeGameMode.path = a_path;
            GH.activeGameMode.start();
            Debug.Log("[GMManager] Created and started GameMode - " + GH.activeGameMode.name, "cyan");
            
        });
    }
}



module.exports = GameManager;
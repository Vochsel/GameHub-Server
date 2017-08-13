/* External Dependencies */
const EventEmitter  = require('events');

/* Internal Dependencies */
const GH            = require('../gamehub.js');
const Utils         = require('../utilities/utils.js');
const Debug         = require('../utilities/debug.js');

class GameMode extends EventEmitter {
    constructor(a_options) {
        super();

        /* ---------- GameMode Debug Info ---------- */

        Debug.SetLogPrefix("GM");

        /* ---------- GameMode Properties ---------- */

        //Literal name of GameMode
        this.name = (a_options && Utils.Valid(a_options.name.length)) ? a_options.name : "Untitled GameMode";

        //Version of GameMode
        this.version = (a_options && Utils.Valid(a_options.version.length)) ? a_options.version : "Invalid Version";

        //Per GameMode data storage
        this.collections = new Object();

        //Array of all stages for this GameMode
        this.stages = new Array();

        //Current stage index
        this.currentStageIdx = -1;   

        //GameMode Resources
        this.resources = new Map();

        //Emit Initialized
        this.emit("initialized");
        
        //Setup GameMode
        this.setup();

        /* ---------- GameMode Debug Info ---------- */
        Debug.Log("Created GameMode - " + this.name, "green");
        Debug.ResetLogPrefix();
    }

    // -- Creates and resets all properties to default values
    reset() {
        //Current stage index
        this.currentStageIdx = 0;
    }

    // -- Initial setup of GameMode
    setup() {
        var self = this;

        //TODO: Should this be an event, or own func
        this.on("deviceHandshake", function(a_device) {
            if(!a_device)
                return;

            self.currentStage.currentState.execute(a_device);
        })
    }

    // -- Starts GameMode
    start() {
        // -- GM Debug Information
        Debug.SetLogPrefix("GM");
        Debug.Log("Starting GameMode: " + this.name, "green");

        this.currentStageIdx = 0;

        //Emit event 'on start'
        this.emit("start");

        // -- Closing GM Debug Information
        Debug.ResetLogPrefix();
    }

    // -- Stops GameMode
    stop() {
        // -- GM Debug Information
        Debug.SetLogPrefix("GM");
        Debug.Log("Stoping GameMode: " + this.name, "green");

        //Emit event 'on stop'
        this.emit("stop");

        // -- Closing GM Debug Information
        Debug.ResetLogPrefix();
    }

    // -- Get current stage from index if available
    getStage(a_idx) {
        //If stage exists, return
        if(a_idx >= 0 && a_idx < this.stages.length) 
            return this.stages[a_idx];

        //Stage does not exist
        Debug.Warning("Only " + this.stages.length + " stages are loaded. Stage does not exist for index: " + a_idx + " (Off by one). Returning null!");
        return null;
    }

    setCurrentStage(a_idx) {
        //Check if valid state
        if(a_idx >= 0 && a_idx < this.stages.length) {
            this.currentStageIdx = a_idx;
            this.emit("changedState", this.currentStageIdx);
            //Maybe move?
            GH.deviceManager.devices.forEach(function(device) {
                this.currentStage.currentState.execute(device);
            }, this);
            //GH.deviceManager.broadcast(new Message("view", a_string).stringify())
        }
    }

    get currentStage() {
        var s = this.getStage(this.currentStageIdx);
        if(s) return s;
    }

    progressGameMode() {
        var nextStateIdx = this.currentStage.currentStateIdx + 1;
        
        //If next state doesnt exist, go to next stage
        if(nextStateIdx >= this.currentStage.states.length)
        {
            //Finished stage, go to next stage
            var nextStageIdx = this.currentStageIdx + 1;

            if(nextStageIdx >= this.stages.length) {
                //Reached last stage, ending GameMode
                this.stop();
                return;
            }
            this.setCurrentStage(nextStageIdx);
            Debug.Log("Progressed to next Stage - " + nextStageIdx, "cyan");
            return;
        }

        //Next state does exist, set to that
        //this.currentStage.currentStateIdx = nextStateIdx;
        this.setCurrentStage(nextStageIdx);
        
        Debug.Log("Progressed to next State - " + nextStateIdx, "magenta");
    }

    status() {
        return "[Stage] : " + this.currentStage.name + ". [State] : " + this.currentStage.currentState.name + ".";
    }

    isValidated() {
        if(this.currentStage.currentState.isValidated()) {
            this.progressGameMode();
        }
    }

    addResource(a_resource) {
        this.resources.set(a_resource.uid, a_resource);
    }
}

class GameModeManager {
    constructor() {
        // -- GameMode Manager Properties
        this.gamemode = null;

        // -- GameMode Manager Functions
        this.SetGameMode(a_gamemode)
        {
            this.gamemode = a_gamemode;
        }
    }
}


// -- Exports State Class

module.exports.GameMode = GameMode;
module.exports.GameModeManager = GameModeManager;
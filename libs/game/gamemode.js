/* External Dependencies */
const EventEmitter  = require('events');

/* Internal Dependencies */
const GH            = require('../gamehub.js');
const Utils         = require('../utilities/utils.js');
const Debug         = require('../utilities/debug.js');

class GameMode extends EventEmitter {
    // -- GameMode Constructor
    constructor(a_options) {
        super();

        /* ---------- GameMode Properties ---------- */

        //Literal name of GameMode
        this.name = (a_options && Utils.Valid(a_options.name)) ? a_options.name : "Untitled GameMode";

        //Version of GameMode
        this.version = (a_options && Utils.Valid(a_options.version)) ? a_options.version : "Invalid Version";

        //Per GameMode data storage
        this.initialModel = (a_options && Utils.Valid(a_options.model)) 
            ? (Debug.Log(" - Loaded model!", "green"), a_options.model)
            : new Object();

        this.model = Utils.Clone(this.initialModel);

        //Array of all stages for this GameMode
        this.stages = new Array(); 

        //GameMode Resources
        this.resources = new Map();

        //GameMode Flow
        this.flow = (a_options && Utils.Valid(a_options.flow)) 
            ? a_options.flow 
            : [
                { 
                    stage: "introStage",
                    repeats: 1
                },
                { 
                    stage: "gameStage",
                    repeats: 1
                },
                { 
                    stage: "outroStage",
                    repeats: 1
                },
            ];

        // -- Internal Data

        //Current stage index
        this.currentStageIdx = -1;

        this.currentFlowIdx = -1;

        this.currentFlowRepeat = 0;

        //Emit Initialized
        this.emit("initialized");

        /* ---------- GameMode Debug Info ---------- */
        Debug.Log("[GM] Creating GameMode - " + this.name + " - Version: " + this.version, "green");
    }

    // -- Creates and resets all properties to default values
    reset() {
        //Current stage index
        this.currentStageIdx = 0;
        this.currentFlowIdx = 0;
        this.currentFlowRepeat = 0;

        this.model = Utils.Clone(this.initialModel);
    }

    // -- Initial setup of GameMode
    setup() {
        var self = this;

        //TODO: Should this be an event, or own func
        this.on("deviceHandshake", function(a_device) {
            if(!a_device)
                return;
            a_device.sendState(self.currentStage.currentState);

        })
    }

    // -- Starts GameMode
    start() {
        this.setup();
        // -- GM Debug Information
        Debug.SetLogPrefix("GM");
        Debug.Log("Starting GameMode - " + this.name, "green");

        this.currentStageIdx = 0;
        this.currentFlowIdx = 0;
        this.currentFlowRepeat = 0;

        //Reset devices? Wrong place
        GH.deviceManager.devices.forEach(function(a_device) {
            a_device.reset();
        }, this);

        //Emit event 'on start'
        this.emit("start");
        
        //Enter stage
        this.currentStage.enter();
        
        //Broadcast state
        //TODO: Move this to state class?
        //GH.deviceManager.broadcastState(this.currentStage.currentState);
        
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

    // -- Get stage from index if available
    getStage(a_idx) {
        if(this.stages.length <= 0)
            return null;

        //If stage exists, return
        if(a_idx >= 0 && a_idx < this.stages.length) 
            return this.stages[a_idx];

        //Stage does not exist
        Debug.Warning("Only " + this.stages.length + " stages are loaded. Stage does not exist for index: " + a_idx + " (Off by one). Returning null!");
        return null;
    }

    // -- Get stage by name if available
    getStageIdxByName(a_name) {
        //Loop through all stages
        for(var i = 0; i < this.stages.length; i++) {

            //Store ref to current iteration
            var stage = this.stages[i];

            //If stage name is the same as a_name, return
            if(stage.name === a_name)
                return i;
        }

        //No stage with name supplied has been found
        Debug.Warning("No stage was found with name: " + a_name + "! Returning null!");

        //Return null
        return null;
    }

    setCurrentStage(a_idx) {
        //Check if valid state
        if(a_idx >= 0 && a_idx < this.stages.length) {
            this.currentStage.exit();

            /*GH.deviceManager.devices.forEach(function(a_device) {
                //Should a_device reset role...
                if(a_device.shouldResetRole)
                    a_device.reset();
            }, this);*/

            this.currentStageIdx = a_idx;
            this.currentStage.enter();
            this.emit("changedState", this.currentStageIdx);

            GH.deviceManager.broadcastState(GH.activeGameMode.currentStage.currentState);
            Debug.Log("Set GM current stage");
            return;
        }
        Debug.Error("Could not Set GM current stage - " + a_idx);
    }

    get currentStage() {
        //var s = this.getStage(this.currentStageIdx);
        var s = this.getStage(this.getStageIdxByName(this.flow[this.currentFlowIdx].stage));
        if(s) return s;
    }

    progressGameMode() {
        
        var nextStateIdx = this.currentStage.currentStateIdx + 1;
        
        //If next state doesnt exist, go to next stage
        if(nextStateIdx >= this.currentStage.states.length)
        {
            //Increment how many times this flow stage has repeated...
            this.currentFlowRepeat += 1;

            //Finished stage, go to next stage
            var nextStageIdx = this.currentStageIdx + 1;
            

            if(this.currentFlowRepeat < this.flow[this.currentFlowIdx].repeats) {
                Debug.Log("---------- Repeating", "yellow");
                //this.setCurrentStage(this.getStageIdxByName(this.flow[this.currentFlowIdx].stage));
                this.setCurrentStage(this.currentStageIdx);
                //this.currentStage.reset();
                //this.currentStage.setCurrentState(0);
                
                return;
                //this.currentStage.reset();
            }

            
            if(nextStageIdx >= this.stages.length) {
                //Reached last stage, ending GameMode
                this.stop();
                return;
            }

            this.currentFlowRepeat = 0;
            this.currentFlowIdx += 1;

            this.setCurrentStage(nextStageIdx);
        
            Debug.Log("Progressed to next Stage - " + nextStageIdx, "cyan");
            return;
        }

        //Next state does exist, set to that
        //this.currentStage.currentStateIdx = nextStateIdx;
        this.currentStage.setCurrentState(nextStateIdx);
        
        Debug.Log("Progressed to next State - " + nextStateIdx, "magenta");
    }

    logStatus() {
        return "[Stage] : " + this.currentStage.name + ". [State] : " + this.currentStage.currentState.name + ".";
    }

    isValidated() {
        if(this.currentStage.currentState.isValidated()) {
            console.log("Progressing");
            this.progressGameMode();
        }
    }

    // -- Store resource in map with uid as key
    addResource(a_resource) {
        this.resources.set(a_resource.uid, a_resource);
    }

    log() {
        Debug.Log("[GM] GameMode - " + this.name + " | Version: " + this.version, "green");
        Debug.Log("[GM] Number of Resources - " + this.resources.size, "green")
        Debug.Log("[GM] Number of Stages - " + this.stages.length, "green")
        
        for(var i = 0; i < this.stages.length; i++) {
            Debug.Log("[GM] Stage (" + i + ") - " +  this.stages[i].name, "green");
            this.stages[i].log();
        }
    }
}

// -- Exports State Class

module.exports = GameMode;
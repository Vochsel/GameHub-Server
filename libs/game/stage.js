/* External Dependencies */
const EventEmitter  = require('events');

/* Internal Dependencies */
const Utils			= require('../utilities/utils.js');
const Debug			= require('../utilities/debug.js');
const GH            = require('../gamehub.js');

class Stage extends EventEmitter {

    constructor(a_options) {
        super();

        /* ---------- Stage Debug Info ---------- */
        Debug.SetLogPrefix("Stage");

        /* ---------- Stage Callbacks ---------- */

        //Stage enter callback
        if(a_options.enter) {
            this.on("enter", a_options.enter);
        }

        //Stage exit callback
        if(a_options.exit) {
            this.on("exit", a_options.exit);
        }
        
        /* ---------- Stage Properties ---------- */
        
        //Literal name of stage
        this.name = (a_options && Utils.Valid(a_options.name)) 
            ? a_options.name
            : "Untitled Stage";
        
        Debug.Log("Creating Stage - " + this.name, "cyan");

        //Per stage data storage
        this.initialModel = (a_options && Utils.Valid(a_options.model)) 
            ? (Debug.Log(" - Loaded model!", "cyan"), a_options.model)
            : new Object();

        this.model = Utils.Clone(this.initialModel);

        //Array of states defined for this stage
        this.states = (a_options && Utils.Valid(a_options.states)) 
            ? (Debug.Log("Loaded " + Utils.Length(a_options.states) + " states!", "cyan"), a_options.states)
            : new Array();

        this.currentStateIdx = 0;

        /* ---------- Stage Debug Info ---------- */
        Debug.Log("Created Stage Successfully", "cyan");        
        Debug.ResetLogPrefix();
    }

    reset() {        
        Debug.Log("Reset Stage - " + this.name, "cyan");
        //TODO: Fix more permanently!
        this.model = Utils.Clone(this.initialModel);

        for(var i = 0; i < this.states.length; i++) {
            this.states[i].reset();
        }

        //this.states.forEach(function(a_state) {
        //    a_state.reset();
        //}, this);

        //Reset current state to 0
        this.setCurrentState(0);

        //Emit event 'on reset'
        this.emit("reset");
    }

    setup() {
        this.emit("setup");
    }

    // -- Called when stage is entered
    enter() {
        this.reset();

        Debug.Log("Enter Stage - " + this.name, 'cyan');

        //Emit event 'on enter'
        this.emit("enter");
    }

    // -- Called when stage is exited
    exit() {
        Debug.Log("Exit Stage - " + this.name, 'cyan');
        
        //Emit event 'on exit'
        this.emit("exit");
    }

    // -- Get current state from index if available
    getState(stateIdx) {
        //If state exists, return
        if(stateIdx >= 0 && stateIdx < this.states.length) {
            var state = this.states[stateIdx];
            //Debug.Log("Found state [" + state.name + "] at index: " + stateIdx, "cyan");
            return state;
        }

        //State does not exist
        Debug.Warning("State does not exist for index: " + stateIdx + ". Returning null!");
        return null;
    }

    // -- Getter to get the current state
    get currentState() {
        return this.getState(this.currentStateIdx);
    }

    setCurrentState(a_idx) {
        //Check if valid state
        if(a_idx >= 0 && a_idx < this.states.length) {
            this.currentState.exit();
            /*GH.deviceManager.devices.forEach(function(a_device) {
                //Should a_device reset role...
                if(a_device.shouldResetRole)
                    a_device.reset();
            }, this);*/
            this.currentStateIdx = a_idx;
            this.currentState.enter();
            this.emit("changedState", this.currentStateIdx);

            GH.deviceManager.broadcastState(GH.activeGameMode.currentStage.currentState);
        }
    }

    // -- Overridable function to validate the stage
    isValidated() {
        return true;
    }

    progressStage() {
        Debug.Log("Progressing Stage", "cyan");
        //Early exit if state is not valid to be left
        if(!this.getState(currentState).isValidated())
            return;

        //If valid next state, set current state to next
        if(this.nextStateIdx >= 0)
            this.currentStateIdx = this.nextStateIdx;
    }

    execute() {
        Debug.SetLogPrefix("Stage");
        
        Debug.Log("Executing stage " + this.name, "cyan");
        Debug.ResetLogPrefix();
    }

    log() {
        Debug.Log("[Stage] Name - " + this.name, "cyan");
        Debug.Log("[Stage] Model Variables - " + Utils.Length(this.model), "cyan");
        Debug.Log("[Stage] Number of States - " + Utils.Length(this.states), "cyan");

        for(var i = 0; i < Utils.Length(this.states); i++) {
            Debug.Log("[Stage] State [" + i + "]", "cyan");
            Debug.Log("[Stage] - State: " + this.states[i].name, "cyan");    
            //this.states[i].log();
        }
    }
}

// -- Exports Stage Class

module.exports = Stage;
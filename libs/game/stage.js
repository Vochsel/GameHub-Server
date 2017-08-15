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

        /* ---------- Stage Properties ---------- */
        
        //Literal name of stage
        this.name = (a_options && Utils.Valid(a_options.name)) 
            ? a_options.name
            : "Untitled Stage";

        //Per stage data storage
        this.collections = (a_options && Utils.Valid(a_options.collections)) 
            ? a_options.collections
            : new Object();

        this.model = (a_options && Utils.Valid(a_options.model)) 
            ? a_options.model
            : new Object();

        this.data = (a_options && Utils.Valid(a_options.data)) 
            ? a_options.data
            : new Object();

        //Array of states defined for this stage
        this.states = (a_options && Utils.Valid(a_options.states)) 
            ? a_options.states
            : new Array();

        this.currentStateIdx = 0;

        /* ---------- Stage Debug Info ---------- */
        Debug.Log("Created Stage - " + this.name, "cyan");
        Debug.ResetLogPrefix();
    }

    reset() {        
        //Reset current state to 0
        this.currentStateIdx = 0;

        //Emit event 'on reset'
        this.emit("reset");
    }

    setup() {
        this.emit("setup");
    }

    // -- Called when stage is entered
    enter() {
        this.reset();

        //Emit event 'on enter'
        this.emit("enter");
    }

    // -- Called when stage is exited
    exit() {
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
            this.currentState.emit("exit");
            this.currentStateIdx = a_idx;
            this.currentState.emit("enter");
            this.emit("changedState", this.currentStateIdx);
            //Maybe move?
            GH.deviceManager.devices.forEach(function(device) {
                this.currentState.execute(device);
            }, this);
            //GH.deviceManager.broadcast(new Message("view", a_string).stringify())
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
}

// -- Exports Stage Class

module.exports = Stage;
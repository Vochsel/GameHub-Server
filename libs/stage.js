const EventEmitter = require('events');

const Debug = require('./debug.js');

class Stage extends EventEmitter {

    constructor(a_name) {
        super();
        
        /* ---------- Stage Debug Info ---------- */
        Debug.SetLogPrefix("Stage");

        /* ---------- Stage Properties ---------- */
        
        //Literal name of stage
        this.name = (a_name.length != 0) ? a_name : "Untitled Stage";

        //Per stage data storage
        this.collections = new Object();

        //Array of states defined for this stage
        this.states = new Array();

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
            Debug.Log("Found state [" + state.name + "] at index: " + stateIdx, "cyan");
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
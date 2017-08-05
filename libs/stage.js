const Debug = require('./debug.js');

class Stage {

    constructor(a_name) {
        /* ---------- Stage Debug Info ---------- */
        Debug.SetLogPrefix("Stage");

        /* ---------- Stage Properties ---------- */
        
        //Literal name of stage
        this.name = (a_name.length != 0) ? a_name : "Untitled Stage";

        //Per stage data storage
        this.collections = new Object();

        //Array of states defined for this stage
        this.states = new Array();

        /* ---------- Stage Debug Info ---------- */
        Debug.Log("Created Stage - " + this.name, "cyan");
        Debug.ResetLogPrefix();
    }

    reset() {        
        //Current state
        this.currentStateIdx = -1;
    }

    start() {
        this.currentStateIdx = 0;
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
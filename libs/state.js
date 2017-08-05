const Debug = require('./debug.js');

class State {
    constructor(a_name) {
        /* ---------- State Debug Info ---------- */
        Debug.SetLogPrefix("State");
        
        /* ---------- State Properties ---------- */

        //Literal name of the state
        this.name = (a_name.length != 0) ? a_name : "Untitled State";

        //Per state data storage
        this.collections = new Object();

        //Domain specific controller for state
        this.controllers = new Object();

        //Domain specific view for state
        this.views = new Object();
        
        /* ---------- State Debug Info ---------- */
        Debug.Log("Created State - " + this.name, "magenta");
        Debug.ResetLogPrefix();
    }

    reset() {

    }

    // -- Overridable function to validate the state
    isValidated() {
        return true;
    }

    execute() {
        Debug.SetLogPrefix("State");
        
        Debug.Log("Executing state " + this.name, "cyan");
        Debug.ResetLogPrefix();        
    }
}

class View {
    constructor() {
        
    }

    loadFromFile(path) {

    }
}

// -- Exports State Class

module.exports = State;
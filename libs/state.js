const EventEmitter = require('events');

const Debug = require('./debug.js');

class State extends EventEmitter {
    constructor(a_name) {
        super();
        
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
        //Emit event 'on reset'
        this.emit("reset");
    }

    // -- Called when state is entered
    enter() {
        //Emit event 'on enter'
        this.emit("enter");
    }

    // -- Called when state is exited
    exit() {
        //Emit event 'on exit'
        this.emit("exit");
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
    constructor(a_type, a_role) {
        //View type, specifies what device will recieve view
        this.type = (a_type.length != 0) ? a_type : "default";

        //View role, specifies which subset of devices will recieve view
        this.role = (a_role.length != 0) ? a_role : "default";
    }

    loadFromFile(path) {
        
    }
}

// -- Exports State Class

module.exports = State;
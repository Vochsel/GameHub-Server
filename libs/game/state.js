/* External Dependencies */
const EventEmitter  = require('events');

/* Internal Dependencies */
const GH            = require('../gamehub.js');
const Utils         = require('../utilities/utils.js');
const Debug         = require('../utilities/debug.js');

class State extends EventEmitter {
    constructor(a_options) {
        super();

        /* ---------- State Debug Info ---------- */
        Debug.SetLogPrefix("State");
        
        /* ---------- State Properties ---------- */

        //Literal name of the state
        this.name = (a_options && Utils.Valid(a_options.name)) ? a_options.name : "Untitled State";
        
        Debug.Log("Created State - " + this.name, "magenta");        

        //Per state data storage
        this.collections = new Object();

        //Domain specific controller for state
        this.controllers = (a_options && Utils.Valid(a_options.controllers)) 
            ? Array.from(a_options.controllers)
            : new Array();

        //Debug.Log("Controllers: " + JSON.stringify(this.controllers), "magenta");
        Debug.Log(" - Loaded " + this.controllers.length + " controllers!", "magenta");

        //Domain specific views for state
        this.views = (a_options && Utils.Valid(a_options.views)) 
            ? Array.from(a_options.views)
            : new Array();

        Debug.Log(" - Loaded " + this.views.length + " views!", "magenta");
        
        /* ---------- State Debug Info ---------- */
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

        //Distribute views to all devices
        var self = this;
        GH.deviceManager.devices.forEach(function(device) {
            for(var i = 0; i < self.views.length; i++) {
                var view = self.views[i];
                device.sendView(view);
            }
        }, this);

        Debug.ResetLogPrefix();        
    }
}


// -- Exports State Class

module.exports = State;
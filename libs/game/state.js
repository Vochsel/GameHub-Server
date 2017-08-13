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

        //Alternative per state data storage
        this.model = (a_options && Utils.Valid(a_options.model)) 
            ? (a_options.model)
            : new Object();

        //Domain specific controller for state
        this.controller = (a_options && Utils.Valid(a_options.controller)) 
            ? (a_options.controller)
            : new Object();

        //Debug.Log("Controllers: " + JSON.stringify(this.controllers), "magenta");
        Debug.Log(" - Loaded " + this.controller.length + " controllers!", "magenta");

        //Domain specific views for state
        this.views = (a_options && Utils.Valid(a_options.views)) 
            ? Array.from(a_options.views)
            : new Array();

        // -- Function overloads
        if(a_options.isValidated) {
            this.isValidated = a_options.isValidated;
        }

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
        //return true;
        //return this.isValidated();
    }

    execute(a_device) {
        Debug.SetLogPrefix("State");
        
        Debug.Log("Executing state " + this.name, "cyan");

        //Get best view
        var view = this.getBestViewForDevice(a_device);

        if(!view)
            return Debug.Error("Could not find view for device!");
        
        var viewSrc = Utils.FormatStringWithData(view.data, {
            gm: GH.activeGameMode, 
            stage: GH.activeGameMode.currentStage.collections, 
            state: this.model
        }); //maybe move to controller?

        //Send view to device
        a_device.sendView(viewSrc);

        Debug.ResetLogPrefix();        
    }

    // -- Utilitiy Functions
    getBestViewForDevice(a_device) {
        var bestView = null;

        for(var i = 0; i < this.views.length; i++) {
            var view = this.views[i];

            //Log out device type and desired view type            
            Debug.Log("Type = " + a_device.type + " : " + view.type, "red");
            //Log out device role and desired view role
            Debug.Log("Role = " + a_device.role + " : " + view.role, "red");

            //Check if type matches
            if(a_device.type === view.type /*|| a_device.type === "default"*/) {
                //Check if role matches
                if(a_device.role === view.role || view.role === "default") {    //Changed second condition from device to view
                    //Found best view for device
                    bestView = view;
                    return bestView;
                }
            }
        }

        return null;
    }
}


// -- Exports State Class

module.exports = State;
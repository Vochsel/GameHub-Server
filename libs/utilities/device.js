/* External Dependencies */
const EventEmitter  = require('events');

/* Internal Dependencies */
const Debug         = require('./debug.js');
const Message       = require('./message.js');
const GH            = require('../gamehub.js');
const Utils         = require('../utilities/utils.js');

class Device extends EventEmitter {
    constructor(a_socket, a_options) {
        //Call Event Emitter constructor
        super();

        //Store reference to client socket
        this.socket = a_socket;
        
            //Client IP address
            this.clientIP = this.socket._socket.remoteAddress;

        //Type of device, this determines which view it will recieve
        this.initialType = this.type = (a_options && Utils.Valid(a_options.type)) ? a_options.type : "default";

        //Role of device, determines which sub view device will get
        this.initialRole = this.role = (a_options && Utils.Valid(a_options.role)) ? a_options.role : "default";

        this.name = (a_options && Utils.Valid(a_options.name)) ? a_options.name : "Mr No Name";

        //Device unique ID
        this.uid = this.generateUID();

        //Should device refresh view
        this.shouldRefreshView = false;

        //Should device reset role on state change
        this.shouldResetRole = false;
    }

    generateUID() {
        return this.clientIP + "-" + this.initialType + "-" + this.initialRole;
    }

    sendMessage(a_type, a_data) {
        this.socket.send(new Message(a_type, a_data).stringify());
    }

    sendState(a_state) {
        //Get best view
        var view = a_state.getBestViewForDevice(this);
        
        //Check if found view
        if(!view)
            return Debug.Error("Could not find view for device [" + this.uid + "] in " + a_state.name + "!");
        
        //Format view with provided object
        var viewSrc = Utils.FormatStringWithData(view.data, {
            gm: GH.activeGameMode, 
            stage: GH.activeGameMode.currentStage, 
            state: GH.activeGameMode.currentStage.currentState.model
        }); //maybe move to controller?

        //Send view
        this.sendMessage("view", viewSrc);

        //Send out success log message
        Debug.Log("[Device] Sent view to device", "blue");
    }

    //Check if device is alive
    checkStatus() {
        if(this.socket.isAlive === false) {
            this.socket.terminate();
            return false;
        }

        this.socket.isAlive = false;
        this.socket.ping('', false, true);
        return true;
    }

    reset() {
        //console.trace("RESET DEVICE");
        this.role = this.initialRole;
        this.type = this.initialType;
    }

    refreshView() {
        this.sendState(GH.activeGameMode.currentStage.currentState);
    }

    
}

module.exports = Device;